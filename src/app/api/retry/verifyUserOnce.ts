import { Status, serveStatus } from "src/lib/time";
import Rokaf from "../rokaf/rokaf";
import {
  UnconnectedPost,
  PostQueue,
  UserQueue,
  User,
  UnidentifiedUser,
} from "src/db";

enum VerifyStatus {
  verify,
  notfound,
  skip,
  unidentify,
}

export async function verify({
  userId,
  generation,
  name,
  birth,
}) {
  const status = serveStatus(generation);

  // 2주전에서 수료후 특학까지 유저인증 가능, 안보내진 편지 보내기 위해 그리고 나중에 혹시모를 특학 인편을 위해
  // working인데 유저인증 못할때만 유저큐에서 빼기
  switch (status) {
    case Status.before:
    case Status.beginning:
    case Status.discharged:
      return VerifyStatus.skip;
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
        return VerifyStatus.verify;
      } else if (status == Status.working) {
        // 수료를 했는데도 못찾으면 없는 유저로 판단하고 보내버린다.
        await moveUnidentify(userId);
        return VerifyStatus.unidentify;
      } else {
        // member가 null이면 못찾았다고 하기
        return VerifyStatus.notfound;
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
