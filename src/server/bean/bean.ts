import { PrismaPostRepository } from "src/server/repository/post/prismaPostRepository";
import { PrismaPostQueue } from "src/server/repository/postQueue/prismaPostQueue";
import { PrismaUserRepository } from "src/server/repository/user/prismaUserRespository";
import { PrismaUserQueue } from "src/server/repository/userQueue/prismaUserQueue";
import { MailService } from "src/server/service/mail/MailService";
import { RetryService } from "src/server/service/retry/retryService";
import RokafClient from "src/server/service/rokafClient/RokafClient";
import { UserService } from "src/server/service/user/UserService";
import { BeanInterface } from "./beanInterface";

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
