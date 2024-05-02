import { serveStatus, Status } from "src/lib/time";
import { User, UserQueue } from "src/db";
import { Profile } from "src/type";
import RokafClient from "src/service/rokafClient/RokafClient";

/**
 * 유저의 현재 복무상태에 따라 소대번호, 멤버번호를 불러와 업데이트하고 결과 enum을 반환한다.
 */
interface ProfileCallBack {
  onBefore?: (queue) => Promise<any>;
  onError?: (queue) => Promise<any>;
  onComplete?: (queue) => Promise<any>;
  onFail?: (queue) => Promise<any>;
}
export async function syncProfile(profile: Profile,
  event: ProfileCallBack = {}) {
  const status = serveStatus(profile.generation);

  if (status == Status.before || status == Status.beginning) {
    await event.onBefore?.(UserQueue);
    return syncResponse.before;
  }

  const rokafClient = new RokafClient();
  const result = await rokafClient.getProfile(profile.name, profile.birth);

  // 기훈단 서버 오류
  if (!result.serverOn) {
    await event.onError?.(UserQueue);
    return syncResponse.error;
  }

  // 소대번호, 멤버번호를 업데이트하고 연결됬다고 알려줌
  if (result.member) {
    await User.update(profile.userId, {
      memberSeq: result.member.memberSeq,
      sodae: result.member.sodae,
      connect: true,
    });
    await event.onComplete?.(UserQueue);
    return syncResponse.complete;
  } else {
    await event.onFail?.(UserQueue);
    return syncResponse.fail;
  }
}

export function syncResponseToStr(response: syncResponse) {
  switch (response) {
    case syncResponse.before:
      return "BeforeMailTime";
    case syncResponse.complete:
      return `Complete`;
    case syncResponse.error:
      return "ServerConnectionFalse";
    case syncResponse.fail:
      return "Fail";
  }
}

export enum syncResponse { before, complete, error, fail }

