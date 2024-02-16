import { NextResponse } from "next/server";
import { verifyUser } from "src/app/api/retry/verifyUser";
import { repostMail } from "src/app/api/retry/repostMail";
import { makeLogger } from "config/winston";
var cron = require("node-cron");
const logger = makeLogger("repeat");

export class Repeat {
  static singleTon: Repeat | null = null;

  static getInstance() {
    if (!Repeat.singleTon) {
      Repeat.singleTon = new Repeat();
    }
    return Repeat.singleTon;
  }

  run = false;
  task: any | null = null;

  async start() {
     this.run=true;
    console.log("start cron");
    if (!this.task) {
      this.task = cron.schedule(
        "*/3 * * * * *",
        // "00 */4 * * *",
        async () => {
          try {
            console.log('cron 실행!')
           // logger.info("node-cron is executed");
            // await verifyUser();
            // await repostMail();
          } catch (e) {
            logger.error(`node-cron 중 오류발생: ${e}`);
          }
        },
        {
          scheduled: true,
          timezone: "Asia/Seoul",
        },
      );
    } else {
      this.task.start();
      console.log("cron has been running.");
    }
  }

  stop() {
    this.run=false;
    if (this.task) {
       console.log("stop cron");
      this.task.stop();
    } else {
      console.log("no cron");
    }
  }

  status(){
    return this.run;
  }
}
