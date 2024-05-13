import { serveStatus, Status } from "src/lib/time";
import { Profile } from "src/type";
import { ProfileFactory } from 'src/type/factory';
import { createLogger } from "config/logger";
import { UserQueue } from "src/repository/userQueue/userQueue";

const logger = createLogger("UserService");

export class UserService {
  private rokafClient;
  private userRepository;
  private unidentifiedUserRepository;
  private userQueue: UserQueue;
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

  async searchProfileFailEnqueue(profile: Profile) {
    const userId = profile.userId;
    return await this.syncProfile(profile, {
      onBefore: async (_) => {
        await this.userQueue.insert(userId);
      },
      onError: async (_) => {
        await this.userQueue.insert(userId);
      },
      onFail: async (_) => {
        if (serveStatus(profile.generation) == Status.working) {
          // 수료를 했는데도 못찾으면 없는 유저로 판단하고 보내버린다.
          await this.unidentifiedUserRepository.insert(userId);
        } else {
          // 안나오면 나중에 다시 검색
          await this.userQueue.insert(userId);
        }
      },
    });
  }

  async retryGetProfile() {
    const now = new Date();

    let i = 0;
    let queueSize = await this.userQueue.size();

    try {
      while (!(await this.userQueue.empty())) {
        i++;

        const front = await this.userQueue.front();
        if (front.createdAt > now) break;

        const userId = front.userId;

        const user = await this.userRepository.findById(userId);

        const { name, birth, generation, username, connect } = user;
        const profile = ProfileFactory.create({ userId, name, birth, generation, username });

        if (connect) {
          logger.info(`${i}/${queueSize}: (${userId}) | 이미 연결 됌`)
        } else {
          const status = await this.searchProfileFailEnqueue(profile);
          if (status == syncResponse.complete) {
            await this.mailService.sendUnpostedMails(userId)
          }
          logger.info(`${i}/${queueSize}: (${userId}) | ${syncResponseToStr(status)}`)
        }

        await this.userQueue.pop();
      }

    } catch (error) {
      logger.error(`${i + 1}/${queueSize} | ${error}`)
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