
import { UserQueue } from "src/db";
import { makeLogger } from "config/winston";
import { ProfileUpdater, updateStatus } from "src/app/api/service/profileUpdater";
const logger = makeLogger("asyncRegister");

export async function asyncRegister(id: number) {

  // 유저의 현재상태를 체크해야함
  // 각각의 상태마다 다른 로직 필요.
  // 실패시 큐에 넣는 로직, 성공시 큐에서 빼는 로직 두개가 있음.

  const profile = await ProfileUpdater.dbInitialze(id);

  const status = await profile.update();

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

  logger.info(`${profile.getUsername()} (${id}) | ${logMessage}`);
}

