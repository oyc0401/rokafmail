import { Post, User, UserQueue, PostQueue, UnidentifiedUser } from "src/db"
import { PrismaPostRepository } from "src/repository/post/prismaPostRepository";
import { PrismaPostQueueRepository } from "src/repository/postQueue/prismaPostQueueRepository";
import RokafClient from "src/service/rokafClient/RokafClient";

class BeanConfig {
  static storage: any;

  static getStorage() {
    if (!BeanConfig.storage) BeanConfig.storage = BeanConfig.bean();
    return BeanConfig.storage;
  }

  static bean() {
    return {
      postRepository: new PrismaPostRepository(),
      userRepository: User,
      postQueueRepository: new PrismaPostQueueRepository(),
      userQueueRepository: UserQueue,
      undifrinedRepository: UnidentifiedUser,
      rokafClient: new RokafClient(),
    }
  }
}

export const bean = BeanConfig.getStorage();
