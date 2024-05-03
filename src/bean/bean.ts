import { Post, User, UserQueue, PostQueue, UnidentifiedUser } from "src/db"
import { PrismaPostRepository } from "src/repository/post/prismaPostRepository";
import { PrismaPostQueueRepository } from "src/repository/postQueue/prismaPostQueueRepository";
import { PrismaUserRepository } from "src/repository/user/prismaUserRespository";
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
    return {
      postRepository: new PrismaPostRepository(),
      userRepository: new PrismaUserRepository(),
      postQueueRepository: new PrismaPostQueueRepository(),
      userQueueRepository: UserQueue,
      undifrinedRepository: UnidentifiedUser,
      rokafClient: mockRokafClient,
      // rokafClient: new RokafClient(),
    }
  }
}

export const bean = BeanConfig.getStorage();
