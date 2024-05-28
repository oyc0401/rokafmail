"use server";

import { makeLogger } from "config/winston";
import { bean } from "src/bean/bean";
import { Trainee } from "src/service/user/Trainee";
import { UserService, syncResponseToStr } from "src/service/user/UserService";
const logger = makeLogger("Control User");
import { PrismaProfileFactory } from 'src/type/factory';

export async function userDoubleCheck(userId: number) {

  const { userRepository } = bean;
  const user = await userRepository.findById(userId);
  if (!user) {
    return;
  }
  const trainee = new Trainee(user);
  const userService = new UserService(bean);
  const response = await userService.updateProfile(userId, trainee);

  logger.info(`${trainee.username} (${userId}) | ${syncResponseToStr(response)}`)
}

