"use server";

import { makeLogger } from "config/winston";
import { syncProfile, syncResponseToStr } from "src/app/api/service/syncProfile";
const logger = makeLogger("Control User");
import { ProfileFactory } from 'src/type/factory';

export async function userDoubleCheck(userId: number) {

  const profile = await ProfileFactory.loadFromDB(userId);
  const response = await syncProfile(profile);

  logger.info(`${profile.username} (${userId}) | ${syncResponseToStr(response)}`)
}

