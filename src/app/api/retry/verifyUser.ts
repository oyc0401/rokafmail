import { UserQueue } from "src/db";
import { verify } from "./verifyUserOnce";
import { makeLogger } from "config/winston";
import { VerifyStatus } from "./verifyUserOnce";
const logger = makeLogger("verifyUser");

const verifyLog = {
  verify: "verify    ",
  notfound: "notfound  ",
  skip: "skip      ",
  unidentify: "unidentify",
  error: "error",
};
function statusToMsg(status: VerifyStatus) {
  switch (status) {
    case VerifyStatus.verify:
      return verifyLog.verify;
    case VerifyStatus.notfound:
      return verifyLog.notfound;
    case VerifyStatus.skip:
      return verifyLog.skip;
    case VerifyStatus.unidentify:
      return verifyLog.unidentify;
    case VerifyStatus.error:
      return verifyLog.error;
  }
}

export async function verifyUser() {
  // 미인증 유저들
  const unconnected = await UserQueue.findAll();

  const length = unconnected.length;
  logger.debug(`count: ${length}`);

  let verifyCount = 0;
  let notfound = 0;
  let skip = 0;
  let unidentify = 0;
  let i = 1;
  try {
    for (const unconnect of unconnected) {
      const { userId } = unconnect;
      const { username, generation, name, birth } = unconnect.user;
      const userLogForm = `${username} (${userId}) ${name} ${birth} ${generation}`;

      //`${verifyLog.verify} ${userLogForm}`
      const status = await verify({ userId, generation, name, birth });

      switch (status) {
        case VerifyStatus.verify:
          verifyCount++;
          break;
        case VerifyStatus.notfound:
          notfound++;
          break;
        case VerifyStatus.skip:
          skip++;
          break;
        case VerifyStatus.unidentify:
          unidentify++;
          break;
        case VerifyStatus.error:
          throw Error("rokaf server error, verify Stopped.");
      }
      if (status==VerifyStatus.verify) {
        logger.info(`${i}/${length} | ${statusToMsg(status)} ${userLogForm}`);
      } else {
        logger.debug(`${i}/${length} | ${statusToMsg(status)} ${userLogForm}`);
      }

      i++;
    }
  } catch (error) {
    logger.info(`${i}/${length} | ${error}`);
  }
  logger.info(
    `verify: ${verifyCount}, notfound: ${notfound}, skip: ${skip} unidentify: ${unidentify} missing:${
      length - verifyCount - notfound - skip - unidentify
    }`,
  );
}
