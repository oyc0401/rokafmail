import { makeLogger } from "config/winston";
import { Post, UserQueue, UnidentifiedUser, PostQueue } from "src/db";
import { Status, serveStatus } from "src/lib/time";
import { loadProfileFromDB, createProfile } from 'src/type/factory';
import { syncResponse, syncProfile } from "../service/syncProfile";
import { MailService, sendStatusToStr } from "src/service/mail/MailService";
import { bean } from "src/bean/bean";

const logger = makeLogger("verifyUser");

const MAX_COUNT = 10;

export async function verifyUser() {
  // 미인증 유저들
  const userQueue = await UserQueue.findAll();

  try {
    for (let i = 0; i < userQueue.length; i++) {
      const top = userQueue[i];
      await processUserQueue(top, `${i + 1}/${userQueue.length}`);
      await UserQueue.deleteById(top.id)
    }
  } catch (error) {
    logger.error(`traverseUserQueue | ${error}`);
  }

}

async function processUserQueue(top, progres) {
  const { userId } = top;
  const { name, birth, generation, username } = top.user;

  const profile = createProfile({ userId, name, birth, generation, username });
  const status = await syncProfile(profile);

  const loggingInfo = (msg) => logger.info(`${progres}: (${userId}) | ${msg}`);
  const loggerError = (msg) => logger.error(`${progres}: (${userId}) | ${msg}`);
  switch (status) {
    case syncResponse.before:
      loggingInfo('BeforeMailTime')
      break;
    case syncResponse.complete:
      loggingInfo('Complete')
      await sendPosts(userId);
      break;
    case syncResponse.error:
      loggerError('Stop - ServerConnectionFalse')
      throw Error("Stop - ServerConnectionFalse");
    case syncResponse.fail:

      if (serveStatus(profile.generation) == Status.working) {
        // 수료를 했는데도 못찾으면 없는 유저로 판단하고 보내버린다.
        await UnidentifiedUser.insert({ userId });
        loggingInfo('Shift - Unidentify')
      } else {
        // 유저의 오기입
        loggingInfo('Fail')
      }
      break;
  }
}


// 해당 유저의 모든 미발송 편지들을 다시 보내기
export async function sendPosts(userId: number) {

  let posts = await Post.findNotPostedByUserId(userId);

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];

    if (i < MAX_COUNT) {
      const mailService = new MailService(bean);

      const response = await mailService.sendMail(post.id, {
        onFalse: async (queue) =>
          await queue.insert({ postId: post.id, userId: post.userId })
      })
      logger.info(`(${post.id}) | ${sendStatusToStr(response)}`)

    } else {
      // 한번에 많이 보내지 않게 나머지는 큐에 넣음
      PostQueue.insert({ postId: post.id, userId: post.userId });
    }
  }

}
