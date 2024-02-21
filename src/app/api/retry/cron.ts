import { verifyUser } from "src/app/api/retry/verifyUser";
import { repostMail } from "src/app/api/retry/repostMail";
import { makeLogger } from "config/winston";
var cron = require("node-cron");
const logger = makeLogger("repeat");

export class CronStore {
  static _mailCronSingleTon: Cron | null = null;
  static _userCronSingleTon: Cron | null = null;

  static get mailCron() {
    if (!CronStore._mailCronSingleTon) {
      CronStore._mailCronSingleTon = new Cron(4, async () => {
        try {
          logger.info("mailCron is executed");
          await repostMail();
        } catch (e) {
          logger.error(`node-cron 중 오류발생: ${e}`);
        }
      });
    }
    return CronStore._mailCronSingleTon;
  }

  static get userCron() {
    if (!CronStore._userCronSingleTon) {
      CronStore._userCronSingleTon = new Cron(4, async () => {
        try {
          logger.info("userCron is executed");
          await verifyUser();
        } catch (e) {
          logger.error(`node-cron 중 오류발생: ${e}`);
        }
      });
    }
    return CronStore._userCronSingleTon;
  }
}

class Cron {
  constructor(perHour: number, event: Function) {
    this.perHour = perHour;
    this.event = event;
  }
  perHour: number;
  event: Function;
  run = false;
  task: any | null;
  updated: Date | null;

  async start() {
    this.run = true;
    this.updated = new Date();
    if (!this.task) {
      console.log("start - make");
      this.task = cron.schedule(

        //3초마다
         "*/3 * * * * *",
        
        // 10분 마다
        // "*/10 * * * *",

        // 4시간 마다
        // `00 */${this.perHour} * * *`,
        this.event,
        {
          scheduled: true,
          timezone: "Asia/Seoul",
        },
      );
    } else {
      console.log("start - exist");
      this.task.start();
    }
  }

  stop() {
    this.run = false;
    this.updated = new Date();
    if (this.task) {
      console.log("stop cron");
      this.task.stop();
    } else {
      console.log("no cron");
    }
  }

  get status() {
    return this.run;
  }

  get lastUpdated() {
    return this.updated;
  }
}
