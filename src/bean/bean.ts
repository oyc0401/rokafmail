import Rokaf from "src/app/api/rokaf/rokaf"
import { Post, User, UserQueue, PostQueue, UnidentifiedUser } from "src/db"
import { PrismaPostRepository } from "src/repository/post/prismaPostRepository";
import RokafApiClient from "src/service/rokafApi/RokafApiClient";

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
      postQueueRepository: PostQueue,
      userQueueRepository: UserQueue,
      undifrinedRepository: UnidentifiedUser,
      rokafClient: new RokafApiClient(),
    }
  }
}

export const bean = BeanConfig.getStorage();
