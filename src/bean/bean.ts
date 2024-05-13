import { PrismaPostRepository } from "src/repository/post/prismaPostRepository";
import { PrismaPostQueue } from "src/repository/postQueue/prismaPostQueue";
import { PrismaUserRepository } from "src/repository/user/prismaUserRespository";
import { PrismaUserQueue } from "src/repository/userQueue/prismaUserQueue";
import { MailService } from "src/service/mail/MailService";
import MockRokafClient from "src/service/rokafClient/MockRokafClient";
import RokafClient from "src/service/rokafClient/RokafClient";

class BeanConfig {
  static storage: any;

  static initialize() {
    BeanConfig.storage = BeanConfig.bean();
  }

  static getStorage() {
    if (!BeanConfig.storage) {
      BeanConfig.initialize();
    }
    return BeanConfig.storage;
  }

  static bean() {
    const mockRokafClient = new MockRokafClient();
    mockRokafClient.forcedSetPostMailResponse({
      serverOn: true,
      complete: true,
    });


    const repository = {
      postRepository: new PrismaPostRepository(),
      userRepository: new PrismaUserRepository(),
      postQueue: new PrismaPostQueue(),
      userQueue: new PrismaUserQueue(),
      rokafClient: new RokafClient(),
      // rokafClient: mockRokafClient,
    };
    return {
      ...repository,
      mailService: new MailService(repository),
    }
  }
}

export const bean = BeanConfig.getStorage();
