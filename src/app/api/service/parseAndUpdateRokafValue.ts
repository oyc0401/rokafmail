import Rokaf from "../rokaf/rokaf";
import { serveStatus, Status } from "src/lib/time";
import { User } from "src/db";
import { Profile } from "src/type";

/**
 * 유저의 현재 복무상태에 따라 소대번호, 멤버번호를 불러와 업데이트하고 결과 enum을 반환한다.
 */
export async function parseAndUpdateRokafValue(profile: Profile) {
  const status = serveStatus(profile.generation);

  if (status == Status.before || status == Status.beginning) {
    return updateStatus.before;
  }

  const result = await Rokaf.getProfile(profile.name, profile.birth);

  // 기훈단 서버 오류
  if (!result.serverOn) {
    return updateStatus.error;
  }

  // 소대번호, 멤버번호를 업데이트하고 연결됬다고 알려줌
  if (result.member) {
    await User.update(profile.userId, {
      memberSeq: result.member.memberSeq,
      sodae: result.member.sodae,
      connect: true,
    });
    return updateStatus.complete;
  } else {
    return updateStatus.fail;
  }
}
export enum updateStatus {
  before, complete, error, fail
}

