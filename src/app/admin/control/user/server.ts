"use server";

import { verify } from "src/app/api/retry/verifyUserOnce";
import { User, PostQueue, UserQueue } from "src/db";
import { makeLogger } from "config/winston";
import { VerifyStatus } from "src/app/api/retry/verifyUserOnce";
import { repost, RepostStatus } from "src/app/api/retry/repostMailOnce";
import { sendPostQueues } from "src/app/api/retry/sendPostQueues";
const logger = makeLogger("Control User");

// import {} from'src/app/api/retry/'

export async function userDoubleCheck(userId: number) {
  const userQueueElement = await UserQueue.findByUserId(userId);
  if (!userQueueElement) return;

  const { username, name, generation, birth } = userQueueElement.user;
  const status = await verify({ userId, name, generation, birth });

  const userLogForm = `| ${username} (${userId}) ${name} ${birth} ${generation}`;
  let msg = "";
  switch (status) {
    case VerifyStatus.verify:
      msg = `verify ${userLogForm}`;
      logger.info(msg);
      return msg;
    case VerifyStatus.notfound:
      msg = `notfound ${userLogForm}`;
      logger.info(msg);
      return msg;
    case VerifyStatus.skip:
      msg = `skip ${userLogForm}`;
      logger.info(msg);
      return msg;
    case VerifyStatus.unidentify:
      msg = `unidentify ${userLogForm}`;
      logger.info(msg);
      return msg;
    case VerifyStatus.error:
      msg = `error ${userLogForm}`;
      logger.info(msg);
      return msg;
  }
}

export async function resendUserMail(userId: number) {
  logger.info(`resend User | userId: ${userId}`);
  const unposted = await PostQueue.findByUserId(userId);
  sendPostQueues(unposted);
  return "await sendPostQueues(unposted)";
}

export async function resendPostLast(userId: number) {
   logger.info(`resendPostLast | userId: ${userId}`);
  const unposted = await PostQueue.findByUserId(userId);
  return await sendPostQueues(unposted, 1);
}
