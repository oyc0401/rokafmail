"use server";

import { makeLogger } from "config/winston";
const logger = makeLogger("Control User");
import { UserService, syncResponseToStr } from "src/server/service/user/UserService";
import { bean } from "src/server/bean/bean";


export async function userDoubleCheck(userId: number) {
  const userService = new UserService(bean);

  const trainee = await userService.getTrainee(userId);
  const status = await userService.updateRokafProfile(userId, trainee);

  const log = `${trainee.username} (${userId}) | ${syncResponseToStr(status)}`;
  logger.info(log);
  return log;

}


