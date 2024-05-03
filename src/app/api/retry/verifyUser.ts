import { makeLogger } from "config/winston";
import { Post, UserQueue, UnidentifiedUser, PostQueue } from "src/db";
import { Status, serveStatus } from "src/lib/time";
import { ProfileFactory } from 'src/type/factory';
import { MailService, sendStatusToStr } from "src/service/mail/MailService";
import { bean } from "src/bean/bean";
import { UserService, syncResponseToStr } from "src/service/user/UserService";

const logger = makeLogger("verifyUser");

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

  const profile = ProfileFactory.create({ userId, name, birth, generation, username });

  const onFail = async (_) => {
    if (serveStatus(profile.generation) == Status.working) {
      // 수료를 했는데도 못찾으면 없는 유저로 판단하고 보내버린다.
      await UnidentifiedUser.insert({ userId });
    }
  }

  const userService = new UserService(bean);
  const mailService = new MailService(bean);

  const status = await userService.syncProfile(profile, {
    onComplete: async (_) => await mailService.sendUnpostedMails(userId),
    onError: async (_) => {
      const errorMessage = 'Stop - ServerConnectionFalse';
      logger.error(`${progres}: (${userId}) | ${errorMessage}`)
      throw Error("errorMessage");
    },
    onFail: onFail,
  });

  logger.info(`${progres}: (${userId}) | ${syncResponseToStr(status)}`)
}