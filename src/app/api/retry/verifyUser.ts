import { makeLogger } from "config/winston";
import { Post, UserQueue, UnidentifiedUser, PostQueue } from "src/db";
import { Status, serveStatus } from "src/lib/time";
import { loadProfileFromDB } from 'src/type/factory';
import { syncResponse, syncProfile } from "../service/syncProfile";
import { asyncPost } from "../service/asyncPost";

const logger = makeLogger("verifyUser");

export async function verifyUser() {
  // 미인증 유저들
  const userQueue = await UserQueue.findAll();

  try {
    for (let i = 0; i < userQueue.length; i++) {
      const top = userQueue[i];

      const { userId } = top;
      const msg = await _verifyProgram(userId);
      logger.info(`${i}/${userQueue.length}: (${userId}) | ${msg}`);


      PostQueue.deleteById(top.id)

    }
  } catch (error) {
    logger.error(`traverseUserQueue | ${error}`);
  }


}


async function _verifyProgram(userId) {

  const profile = await loadProfileFromDB(userId);

  const status = await syncProfile(profile);

  switch (status) {
    case syncResponse.before:
      return 'QueueAdded - BeforeMailTime'
    case syncResponse.complete:
      await sendPosts(userId);
      return 'Complete'
    case syncResponse.error:
      throw Error("Stop - ServerConnectionFalse");
    case syncResponse.fail:
      // 수료를 했는데도 못찾으면 없는 유저로 판단하고 보내버린다.
      if (serveStatus(profile.generation) == Status.working) {
        // 미등록 사용자 모음에 넣음
        await UnidentifiedUser.insert({ userId });
        return 'Shift - Unidentify'
      }
      return 'QueueAdded - Fail'
  }
}

// 해당 유저의 모든 미발송 편지들을 다시 보내기
async function sendPosts(userId: number) {

  const MAX_COUNT = 10;
  let posts = await Post.findNotPostedByUserId(userId);

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];

    if (i < MAX_COUNT) {
      try {
        await asyncPost(post.id);
      } catch (e) {
        logger.error(`asyncPost (${userId}) | ${e}`);
        PostQueue.insert({ postId: post.id, userId: post.userId });
      }
    } else {
      // 한번에 많이 보내지 않게 나머지는 큐에 넣음
      PostQueue.insert({ postId: post.id, userId: post.userId });
    }
  }

}
