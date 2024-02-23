"use server";

import { verify } from "src/app/api/retry/verifyUserOnce";
import { User } from "src/db";
import { makeLogger } from "config/winston";
import { VerifyStatus } from "src/app/api/retry/verifyUserOnce";
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
