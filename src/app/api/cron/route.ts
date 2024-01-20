import { NextResponse } from "next/server";

import { run } from "../retry/route";
import { getNow } from "src/lib/time";
import { makeLogger } from "config/winston";
const logger = makeLogger("retry");
var cron = require("node-cron");

export async function POST() {
  console.log("cron 시작!");
  // 매일 8,12,18시 마다
  cron.schedule(
    "00 */4 * * *",
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

  return NextResponse.json({ message: "cron 시작" }, { status: 200 });
}
