import { verifyUser } from "src/app/api/retry/verifyUser";
import { repostMail } from "src/app/api/retry/repostMail";
import { makeLogger } from "config/winston";
var cron = require("node-cron");
const logger = makeLogger("cron");

export function init() {
  if (!globalThis.init) {
    globalThis.init = true;
    execute();
  }
}

async function execute() {
  console.log("init");
  logger.info("init");

  cron.schedule(
    "00 */4 * * *",
    () => {
      try {
        logger.info("node-cron is executed");
        run();
      } catch (e) {
        logger.error(`node-cron 중 오류발생: ${e}`);
      }
    },
    {
      scheduled: true,
      timezone: "Asia/Seoul",
    },
  );
}

async function run() {
  await verifyUser();
  await repostMail();
}
