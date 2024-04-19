import Rokaf from "../rokaf/rokaf";
import { serveStatus, Status } from "src/lib/time";
import { User } from "src/db";

export enum updateStatus {
  before, complete, error, fail
}

/**
 * 유저의 정보를 얻어오고, 상태를 DB에 업데이트 한다.
 */
export async function updateProfile({ id, name, birth, generation }): Promise<updateStatus> {
  const status = serveStatus(generation);

  if (status == Status.before || status == Status.beginning) {
    return updateStatus.before;
  }

  const result = await Rokaf.getProfile(name, birth);

  if (!result.serverOn) {
    return updateStatus.error;
  }

  if (result.member) {
    await User.update(id, {
      memberSeq: result.member.memberSeq,
      sodae: result.member.sodae,
      connect: true,
    });
    return updateStatus.complete;
  }

  return updateStatus.fail;
}

