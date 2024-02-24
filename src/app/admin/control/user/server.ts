"use server";

import { verify } from "src/app/api/retry/verifyUserOnce";
import { User, PostQueue } from "src/db";
import { makeLogger } from "config/winston";
import { VerifyStatus } from "src/app/api/retry/verifyUserOnce";
import { repost, RepostStatus } from "src/app/api/retry/repostMailOnce";
import { postUnposteds } from "src/app/api/retry/postUnposteds";
const logger = makeLogger("verifyUser");

// import {} from'src/app/api/retry/'

export async function userDoubleCheck(userId: number) {
  const user = await User.findById(userId);
  if (!user) return;

  const { username, name, generation, birth } = user;
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
  const unposted = await PostQueue.findByUserId(userId);
  return await postUnposteds(unposted);
}

export async function resendPostLast(userId: number) {
  const unposted = await PostQueue.findByUserId(userId);
  return await postUnposteds(unposted,1);
}

