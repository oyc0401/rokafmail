"use server";

import { makeLogger } from "config/winston";
const logger = makeLogger("Control User");
import { ProfileFactory } from 'src/type/factory';
import { UserService, syncResponseToStr } from "src/service/user/UserService";
import { bean } from "src/bean/bean";


export async function userDoubleCheck(userId: number) {

  const profile = await ProfileFactory.loadFromDB(userId);

  const { username } = profile;

  const userService = new UserService(bean);
  const status = await userService.syncProfile(profile);

  const log = `${username} (${userId}) | ${syncResponseToStr(status)}`;
  logger.info(log);
  return log;

}


