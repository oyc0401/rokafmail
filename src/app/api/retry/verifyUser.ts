import { Status, serveStatus } from "src/lib/time";
import Rokaf from "../rokaf/rokaf";
import {
  UnconnectedPost,
  PostQueue,
  UserQueue,
  User,
  UnidentifiedUser,
} from "src/db";
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

type Unconnected = {
  id: number;
  userId: number;
  user: {
    username: string;
    name: string;
    birth: string;
    generation: number;
    memberSeq: string | null;
    sodae: string | null;
  };
};

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
      const { message, status } = await verify(unconnect);
      logger.info(`${i}/${length} | ${message}`);
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
    logger.info(`${i}/${length} | ${error}`);
  }
  logger.info(
    `verify: ${verifyCount}, notfound: ${notfound}, skip: ${skip} unidentify: ${unidentify} missing:${
      length - verifyCount - notfound - skip - unidentify
    }`,
  );
}

async function verifyLogWrapper(){
  
}

async function verify(unconnect: Unconnected) {
  const { userId } = unconnect;
  const { generation, name, birth } = unconnect.user;

  const status = serveStatus(generation);

  // 2주전에서 수료후 특학까지 유저인증 가능, 안보내진 편지 보내기 위해 그리고 나중에 혹시모를 특학 인편을 위해
  // working인데 유저인증 못할때만 유저큐에서 빼기
  const userLogForm = `${userId} ${name} ${birth} ${generation}`;

  switch (status) {
    case Status.before:
    case Status.beginning:
    case Status.discharged:
      return {
        message: `${verifyLog.skip} ${userLogForm}`,
        status: VerifyStatus.skip,
      };
    case Status.training:
    case Status.ending:
    case Status.working:
      let { serverOn, member } = await Rokaf.getProfile(name, birth);

      // 서버가 통신이 끊기면 바로 종료
      if (!serverOn) {
        throw Error("rokaf server error, verify Stopped.");
      }

      // 얻었으면 업데이트
      if (member != null) {
        const { sodae, memberSeq } = member;
        await updateUser(userId, sodae, memberSeq);
        await relocatePost(userId);
        return {
          message: `${verifyLog.verify} ${userLogForm}`,
          status: VerifyStatus.verify,
        };
      } else if (status == Status.working) {
        // 수료를 했는데도 못찾으면 없는 유저로 판단하고 보내버린다.
        await moveUnidentify(userId);
        return {
          message: `${verifyLog.unidentify} ${userLogForm}`,
          status: VerifyStatus.unidentify,
        };
      } else {
        // member가 null이면 못찾았다고 하기
        return {
          message: `${verifyLog.notfound} ${userLogForm}`,
          status: VerifyStatus.notfound,
        };
      }
  }
}



// 미등록 사용자 모음에 넣음
async function moveUnidentify(userId: number) {
  await UnidentifiedUser.insert({ userId });

  // 유저큐에서 삭제
  await UserQueue.deleteByUserId(userId);
}

// 소대번호, 멤버번호 추가하고, 인증됐다고 업데이트
async function updateUser(userId: number, sodae: string, memberSeq: string) {
  await User.update(userId, { connect: true, sodae, memberSeq });

  // 유저큐에서 삭제
  await UserQueue.deleteByUserId(userId);
}

// 모든 연결안된 메일들을 대기열에 올리기
async function relocatePost(userId: number) {
  let posts = await UnconnectedPost.findByUserId(userId);
  await PostQueue.insertMany(posts);

  // delete all
  await UnconnectedPost.deleteByUserId(userId);
}
