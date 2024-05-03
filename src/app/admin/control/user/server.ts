"use server";

import { makeLogger } from "config/winston";
import { bean } from "src/bean/bean";
import { UserService,syncResponseToStr } from "src/service/user/UserService";
const logger = makeLogger("Control User");
import { ProfileFactory } from 'src/type/factory';

export async function userDoubleCheck(userId: number) {

  const profile = await ProfileFactory.loadFromDB(userId);
  const userService = new UserService(bean);
  const response = await userService.syncProfile(profile);

  logger.info(`${profile.username} (${userId}) | ${syncResponseToStr(response)}`)
}

