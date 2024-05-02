import { serveStatus, Status } from "src/lib/time";
import { Profile } from "src/type";


export class UserService {
  private rokafClient;
  private userRepository;
  private userQueue;
  constructor({ userRepository, userQueue, rokafClient }) {
    this.userRepository = userRepository;
    this.userQueue = userQueue;
    this.rokafClient = rokafClient;
  }


  async syncProfile(profile: Profile,
    event: ProfileCallBack = {}) {
    const status = serveStatus(profile.generation);

    if (status == Status.before || status == Status.beginning) {
      await event.onBefore?.(this.userQueue);
      return syncResponse.before;
    }

    const result = await this.rokafClient.getProfile(profile.name, profile.birth);

    // 기훈단 서버 오류
    if (!result.serverOn) {
      await event.onError?.(this.userQueue);
      return syncResponse.error;
    }

    // 소대번호, 멤버번호를 업데이트하고 연결됬다고 알려줌
    if (result.member) {
      await this.userRepository.update(profile.userId, {
        memberSeq: result.member.memberSeq,
        sodae: result.member.sodae,
        connect: true,
      });
      await event.onComplete?.(this.userQueue);
      return syncResponse.complete;
    } else {
      await event.onFail?.(this.userQueue);
      return syncResponse.fail;
    }
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



interface ProfileCallBack {
  onBefore?: (queue) => Promise<any>;
  onError?: (queue) => Promise<any>;
  onComplete?: (queue) => Promise<any>;
  onFail?: (queue) => Promise<any>;
}