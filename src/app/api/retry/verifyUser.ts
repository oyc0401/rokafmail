import { UserQueue} from "src/db";
import{verify} from './verifyUserOnce';
import { makeLogger } from "config/winston";
const logger = makeLogger("verifyUser");

const verifyLog = {
  verify: "verify    ",
  notfound: "notfound  ",
  skip: "skip      ",
  unidentify: "unidentify",
};

enum VerifyStatus {
  verify,
  notfound,
  skip,
  unidentify,
}

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
      const { generation, name, birth } = unconnect.user;
      const userLogForm = `${userId} ${name} ${birth} ${generation}`;
      
      //`${verifyLog.verify} ${userLogForm}`
      const status = await verify({userId ,generation, name, birth });
      logger.info(`${i}/${length} | ${statusToMsg(status)} ${userLogForm}`);

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
      }

      i++;
    }
  } catch (error) {
    logger.debug(`${i}/${length} | ${error}`);
  }
  logger.info(
    `verify: ${verifyCount}, notfound: ${notfound}, skip: ${skip} unidentify: ${unidentify} missing:${
      length - verifyCount - notfound - skip - unidentify
    }`,
  );
}