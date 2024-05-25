import { serveStatus, Status } from "src/lib/time";
import { Profile } from "src/type";
import { ProfileFactory } from 'src/type/factory';
import { createLogger } from "config/logger";
import { UserQueue } from "src/repository/userQueue/userQueue";
import { UserRepository } from "src/repository/user/userRepository";
import { ValidateError } from "src/utils/validate";
import { RokafClientInterface } from "../rokafClient/RokafClientInterface";
import { MailService } from "../mail/MailService";
import { Trainee } from "./Trainee";

const logger = createLogger("UserService");

export class UserService {
  private rokafClient: RokafClientInterface;
  private userRepository: UserRepository;
  private userQueue: UserQueue;
  private mailService: MailService;

  constructor({ userRepository, userQueue, rokafClient, mailService }) {
    this.userRepository = userRepository;
    this.userQueue = userQueue;
    this.rokafClient = rokafClient;
    this.mailService = mailService;
  }

  async existUsername(username: string) {
    const user = await this.userRepository.findByUsername(username);
    return user != null;
  }

  async AsyncRegisterTrainee(trainee: Trainee) {
    if (await this.existUsername(trainee.username)) {
      throw new ValidateError('아이디가 중복되었습니다.');
    }

    // 유저 생성
    const newUser = await this.userRepository.insert(trainee);
    const { id: userId, name, birth, generation, username } = newUser

    // 빠른 응답을 위해 남은 로직은 비동기에서 진행
    const profile = ProfileFactory.create({ userId, name, birth, generation, username });

    this.searchProfileFailEnqueueTrainee(userId, trainee).then((response) =>
      logger.info(`${profile.username} (${userId}) | ${syncResponseToStr(response)}`));

    return userId;
  }



  async getTrainee(userId: number) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw Error('유저가 없습니다.')
    const { username, password, name, birth, generation, message,
      memberSeq, sodae } = user;
    return new Trainee({
      username, password, name, birth, generation, message,
      memberSeq, sodae
    });
  }

  async searchProfileFailEnqueueTrainee(userId: number, trainee: Trainee) {
    const response = await this.syncProfileTrainee(userId, trainee);

    switch (response) {
      case syncResponse.before:
        await this.userQueue.insert(userId);
        break;
      case syncResponse.complete:
        break;
      case syncResponse.error:
        await this.userQueue.insert(userId);
        break;
      case syncResponse.fail:
        const status = serveStatus(profile.generation);
        if (status == Status.working || status == Status.discharged) {
          // 수료를 했는데도 못찾으면 없는 유저로 판단하고 큐에 넣지 않는다.
        } else {
          // 안나오면 나중에 다시 검색
          await this.userQueue.insert(userId);
        }
        break;
    }
    return response;
  }

  /**
   * 유저의 소대번호, 멤버번호를 불러오고, 업데이트 한다.
   */
  async syncProfileTrainee(userId: number, trainee: Trainee) {
    const status = trainee.currentStatus();

    if (status == Status.before || status == Status.beginning) {
      return syncResponse.before;
    }

    const result = await this.rokafClient.getProfile(trainee.name, trainee.birth);

    // 기훈단 서버 오류
    if (!result.serverOn) {
      return syncResponse.error;
    }

    // 소대번호, 멤버번호를 업데이트하고 연결됬다고 알려줌
    if (result.member) {
      await this.userRepository.updateRokafProfile(userId, {
        memberSeq: result.member.memberSeq,
        sodae: result.member.sodae
      });
      return syncResponse.complete;
    } else {
      return syncResponse.fail;
    }
  }




  /**
   * @deprecated
   * 유저의 소대번호, 멤버번호를 불러오고, 엡디
   */
  async syncProfile(profile: Profile) {
    const status = profile.getStatus();

    if (status == Status.before || status == Status.beginning) {
      return syncResponse.before;
    }

    const result = await this.rokafClient.getProfile(profile.name, profile.birth);

    // 기훈단 서버 오류
    if (!result.serverOn) {
      return syncResponse.error;
    }

    // 소대번호, 멤버번호를 업데이트하고 연결됬다고 알려줌
    if (result.member) {
      await this.userRepository.updateRokafProfile(profile.userId, {
        memberSeq: result.member.memberSeq,
        sodae: result.member.sodae
      });
      return syncResponse.complete;
    } else {
      return syncResponse.fail;
    }
  }

  /**
  * @deprecated
  * use registerAsync
  */
  async register(registerProps: RegisterProps) {
    if (await this.existUsername(registerProps.username)) {
      throw new ValidateError('아이디가 중복되었습니다.');
    }

    // 유저 생성
    const newUser = await this.userRepository.insert(registerProps);
    const { id: userId, name, birth, generation, username } = newUser

    // 빠른 응답을 위해 남은 로직은 비동기에서 진행
    const profile = ProfileFactory.create({ userId, name, birth, generation, username });

    this.searchProfileFailEnqueue(profile).then((response) =>
      logger.info(`${profile.username} (${userId}) | ${syncResponseToStr(response)}`));
  }

  /**
   * @deprecated
   * use searchProfileFailEnqueueTrainee
   */
  async searchProfileFailEnqueue(profile: Profile) {
    const userId = profile.userId;
    const response = await this.syncProfile(profile);

    switch (response) {
      case syncResponse.before:
        await this.userQueue.insert(userId);
        break;
      case syncResponse.complete:
        break;
      case syncResponse.error:
        await this.userQueue.insert(userId);
        break;
      case syncResponse.fail:
        const status = serveStatus(profile.generation);
        if (status == Status.working || status == Status.discharged) {
          // 수료를 했는데도 못찾으면 없는 유저로 판단하고 큐에 넣지 않는다.
        } else {
          // 안나오면 나중에 다시 검색
          await this.userQueue.insert(userId);
        }
        break;
    }
    return response;
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

export interface RegisterProps {
  username: string;
  password: string;
  name: string;
  birth: string;
  generation: number;
  message: string;
}

interface ProfileCallBack {
  onBefore?: (queue) => Promise<any>;
  onError?: (queue) => Promise<any>;
  onComplete?: (queue) => Promise<any>;
  onFail?: (queue) => Promise<any>;
}