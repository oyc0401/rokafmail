import { PostRepository } from "src/repository/post/postRepository";
import { PrismaPostRepository } from "src/repository/post/prismaPostRepository";
import { PostQueue } from "src/repository/postQueue/postQueue";
import { PrismaPostQueue } from "src/repository/postQueue/prismaPostQueue";
import { PrismaUserRepository } from "src/repository/user/prismaUserRespository";
import { UserRepository } from "src/repository/user/userRepository";
import { PrismaUserQueue } from "src/repository/userQueue/prismaUserQueue";
import { UserQueue } from "src/repository/userQueue/userQueue";
import { MailService } from "src/service/mail/MailService";
import { RetryService } from "src/service/retry/retryService";
import MockRokafClient from "src/service/rokafClient/MockRokafClient";
import RokafClient from "src/service/rokafClient/RokafClient";
import { RokafClientInterface } from "src/service/rokafClient/RokafClientInterface";
import { UserService } from "src/service/user/UserService";

interface BeanInterface {
  postRepository: PostRepository;
  userRepository: UserRepository;
  postQueue: PostQueue;
  userQueue: UserQueue;
  rokafClient: RokafClientInterface;
  mailService: MailService;
  userService: UserService;
  retryService: RetryService;
}

class BeanConfig {
  static storage: BeanInterface;

  static initialize() {
    BeanConfig.storage = BeanConfig.bean();
  }

  static getStorage() {
    if (!BeanConfig.storage) {
      BeanConfig.initialize();
    }
    return BeanConfig.storage;
  }

  static bean(): BeanInterface {
    // const mockRokafClient = new MockRokafClient();
    // mockRokafClient.changePostMailReturnValue({
    //   serverOn: true,
    //   complete: true,
    // });

    const repository = {
      postRepository: new PrismaPostRepository(),
      userRepository: new PrismaUserRepository(),
      postQueue: new PrismaPostQueue(),
      userQueue: new PrismaUserQueue(),
      rokafClient: new RokafClient(),
      // rokafClient: mockRokafClient,
    };
    const mailService = new MailService(repository);
    const userService = new UserService({ ...repository, mailService });
    const retryService = new RetryService({ ...repository, mailService, userService });
    return {
      ...repository,
      mailService,
      userService,
      retryService,
    }
  }
}


export const bean = BeanConfig.getStorage();
