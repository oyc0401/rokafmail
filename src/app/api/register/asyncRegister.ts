
import { UserQueue } from "src/db";
import { makeLogger } from "config/winston";
import { updateProfile, updateStatus } from "src/app/api/service/updateProfile";
const logger = makeLogger("asyncRegister");




export async function asyncRegister({ id, name, birth, generation, username }) {

  const status = await updateProfile({ id, name, birth, generation });

  let logMessage = '';

  switch (status) {
    case updateStatus.before:
      await UserQueue.insert({ userId: id });
      logMessage = "QueueAdded - BeforeMailTime";
      break;
    case updateStatus.complete:
      logMessage = `Complete`;
      break;
    case updateStatus.error:
      await UserQueue.insert({ userId: id });
      logMessage = "QueueAdded - ServerConnectionFalse";
      break;
    case updateStatus.fail:
      await UserQueue.insert({ userId: id });
      logMessage = "QueueAdded - Fail";
      break;
  }

  logger.info(`${username} (${id}) | ${logMessage}`);
}

