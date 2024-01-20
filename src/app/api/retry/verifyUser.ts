import { Status, serveStatus } from "src/lib/time";
import Rokaf from "../rokaf/rokaf";
import { UnconnectedPost, PostQueue, UserQueue, User } from "src/db";
import { makeLogger } from "config/winston";
const logger = makeLogger("verifyUser");

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

  let i = 1;
  const length = unconnected.length;
  logger.debug(`count: ${length}`);

  let success = 0;
  let notfound = 0;

  try {
    for (const unconnect of unconnected) {
      const { message, data } = await verify(unconnect);
      logger.debug(`${i}/${length}: ${message}`);
      if (data) {
        success++;
      } else {
        notfound++;
      }

      i++;
    }
  } catch (error) {
    logger.info(
      `${i}/${length}: ${error} | success: ${success}, notfound: ${notfound}`,
    );
    return;
  }
  logger.info(
    `success: ${success}, notfound: ${notfound}, missing: ${
      length - success - notfound
    }`,
  );
}

async function verify(unconnect: Unconnected) {
  const { userId } = unconnect;
  const { generation, name, birth } = unconnect.user;

  const status = serveStatus(generation);

  // 2주전에서 수료후 특학까지 유저인증 가능, 안보내진 편지 보내기 위해 그리고 나중에 혹시모를 특학 인편을 위해
  switch (status) {
    case Status.before:
    case Status.beginning:
    case Status.discharged:
      return { message: `can't search status, skip.`, data: false };
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
        return { message: `add ${userId} complete.`, data: true };
      } else {
        return { message: `can't find ${userId}.`, data: false };
      }
  }
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
