import { makeLogger } from "config/winston";
import { Post, UserQueue, UnidentifiedUser } from "src/db";
import { Status, serveStatus } from "src/lib/time";
import { loadProfileFromDB } from 'src/type/factory';
import { updateStatus, parseAndUpdateRokafValue } from "../service/parseAndUpdateRokafValue";
import { asyncPost } from "../service/asyncPost";

const logger = makeLogger("verifyUser");

export async function verifyUser() {
  // 미인증 유저들
  const userQueue = await UserQueue.findAll();

  for (let i = 0; i < userQueue.length; i++) {
    const unconnect = userQueue[i];

    try {
      const { userId } = unconnect;
      const msg = await _verifyProgram(userId);
      logger.info(`${i}/${userQueue.length}: (${userId}) | ${msg}`);

    } catch (error) {
      logger.error(`${i}/${userQueue.length}: (${unconnect.userId}) | ${error}`);
      break;
    }
  }

}


async function _verifyProgram(userId) {

  const profile = await loadProfileFromDB(userId);

  const status = await parseAndUpdateRokafValue(profile);

  switch (status) {
    case updateStatus.before:
      return 'QueueAdded - BeforeMailTime'
    case updateStatus.complete:
      await sendPosts(userId);
      return 'Complete'
    case updateStatus.error:
      throw Error("Stop - ServerConnectionFalse");
    case updateStatus.fail:
      // 수료를 했는데도 못찾으면 없는 유저로 판단하고 보내버린다.
      if (serveStatus(profile.getGeneration()) == Status.working) {
        await moveUnidentify(userId);
        return 'Shift - Unidentify'
      }
      return 'QueueAdded - Fail'
  }
}

// 해당 유저의 모든 미발송 편지들을 다시 보내기
async function sendPosts(userId: number) {
  let posts = await Post.findNotPostedByUserId(userId);

  for (const post of posts) {
    // 오류가 나면 큐에 저장하기
    await asyncPost(post.id);
  }

}

// 미등록 사용자 모음에 넣음
async function moveUnidentify(userId: number) {
  await UnidentifiedUser.insert({ userId });

  // 유저큐에서 삭제
  // 쿼리 너무 느려요 이거!
  await UserQueue.deleteByUserId(userId);
}
