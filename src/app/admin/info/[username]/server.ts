"use server";

import { makeLogger } from "config/winston";
const logger = makeLogger("Control User");
import { UserService, syncResponseToStr } from "src/service/user/UserService";
import { bean } from "src/bean/bean";
import { Trainee } from "src/service/user/Trainee";


export async function userDoubleCheck(userId: number) {

  const { userRepository } = bean;
  const user = await userRepository.findById(userId);
  if (!user) {
    return;
  }
  const trainee = new Trainee(user);
  const userService = new UserService(bean);
  const status = await userService.updateRokafProfile(userId, trainee);

  const log = `${trainee.username} (${userId}) | ${syncResponseToStr(status)}`;
  logger.info(log);
  return log;

}


