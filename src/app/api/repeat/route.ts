import { NextResponse } from "next/server";
import { verifyUser } from "src/app/api/retry/verifyUser";
import { repostMail } from "src/app/api/retry/repostMail";
import { makeLogger } from "config/winston";
var cron = require("node-cron");
const logger = makeLogger("repeat");

class Init {
  static run = false;
}

export async function POST(request: Request) {
  logger.info("POST - repeat");
  if (!Init.run) {
    execute();
    Init.run = true;
  } else {
    logger.error("이미 작동중 입니다. pm2 restart를 하셨나요?");
    return NextResponse.json(
      { message: "이미 작동중 입니다." },
      { status: 200 },
    );
  }

  return NextResponse.json({ message: "시작" }, { status: 200 });
}

async function execute() {
  console.log("cron.schedule start");
  logger.info("cron.schedule start");

  cron.schedule(
   // "*/10 * * * *",
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
