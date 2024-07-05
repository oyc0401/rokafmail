"use server";

import { makeLogger } from "config/winston";
import { bean } from "src/bean/bean";
import { UserService, syncResponseToStr } from "src/service/user/UserService";
const logger = makeLogger("Control User");
import { Trainee } from "src/type/serviceType";

export async function userDoubleCheck(userId: number) {
  const userService = new UserService(bean);

  const trainee: Trainee = await userService.getTrainee(userId);
  const response = await userService.updateRokafProfile(userId, trainee);

  logger.info(`${trainee.username} (${userId}) | ${syncResponseToStr(response)}`)
}

