import { serveStatus, Status } from "src/lib/time";
import { Profile } from "src/type";
import { ProfileFactory } from 'src/type/factory';
import { createLogger } from "config/logger";

const logger = createLogger("UserService");

export class UserService {
  private rokafClient;
  private userRepository;
  private unidentifiedUserRepository;
  private userQueue;
  private mailService;

  constructor({ userRepository, userQueue, rokafClient, mailService, unidentifiedUserRepository }) {
    this.userRepository = userRepository;
    this.userQueue = userQueue;
    this.rokafClient = rokafClient;
    this.mailService = mailService;
    this.unidentifiedUserRepository = unidentifiedUserRepository;
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

  async traverseUserQueue() {
    // 미인증 유저들
    const userQueue = await this.userQueue.findAllWithUser();

    try {
      for (let i = 0; i < userQueue.length; i++) {
        const top = userQueue[i];
        await this.processUserQueue(top, `${i + 1}/${userQueue.length}`);
        await this.userQueue.deleteById(top.id)
      }
    } catch (error) {
      logger.error(`traverseUserQueue | ${error}`);
      throw error
    }

  }

  async processUserQueue(top, progres) {
    const { userId } = top;
    const { name, birth, generation, username, connect } = top.user;

    const profile = ProfileFactory.create({ userId, name, birth, generation, username });

    const onFail = async (_) => {
      if (serveStatus(profile.generation) == Status.working) {
        // 수료를 했는데도 못찾으면 없는 유저로 판단하고 보내버린다.
        await this.unidentifiedUserRepository.insert({ userId });
      }
    }
    
    if (!connect) {
      const status = await this.syncProfile(profile, {
        onComplete: async (_) => await this.mailService.sendUnpostedMails(userId),
        onError: async (_) => {
          const errorMessage = 'Stop - ServerConnectionFalse';
          logger.error(`${progres}: (${userId}) | ${errorMessage}`)
          throw Error("errorMessage");
        },
        onFail: onFail,
      });

      logger.info(`${progres}: (${userId}) | ${syncResponseToStr(status)}`)
    }else{
      logger.info(`${progres}: (${userId}) | 이미 연결 됌`)
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