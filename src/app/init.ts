import { verifyUser } from "src/app/api/retry/verifyUser";
import { repostMail } from "src/app/api/retry/repostMail";
import { makeLogger } from "config/winston";
var cron = require("node-cron");

export function init() {
  if (!globalThis.init) {
      globalThis.init = true;
    execute();
  }
}


async function execute() {
  console.log("init");

  cron.schedule(
    "00 */10 * * * *",
    () => {
      try {
        console.log("node-cron is executed");
        run();
      } catch (e) {
        console.log("node-cron 중 오류발생", e);
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
