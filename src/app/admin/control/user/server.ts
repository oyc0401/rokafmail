"use server";

import { makeLogger } from "config/winston";
import { syncProfile, updateStatus } from "src/app/api/service/parseAndUpdateRokafValue";
const logger = makeLogger("Control User");
import { loadProfileFromDB } from 'src/type/factory';

export async function userDoubleCheck(userId: number) {

  const profile = await loadProfileFromDB(userId);

  const { username, name, generation, birth } = profile;

  const status = await syncProfile(profile);

  const userLogForm = `| ${username} (${userId}) ${name} ${birth} ${generation}`;
  let msg = "";
  switch (status) {
    case updateStatus.complete:
      msg = `verify ${userLogForm}`;
      logger.info(msg);
      return msg;
    case updateStatus.before:
      msg = `before ${userLogForm}`;
      logger.info(msg);
      return msg;
    case updateStatus.fail:
      msg = `fail ${userLogForm}`;
      logger.info(msg);
      return msg;
    case updateStatus.error:
      msg = `error ${userLogForm}`;
      logger.info(msg);
      return msg;
  }
}

