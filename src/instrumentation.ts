import { GET } from "src/app/api/retry/route";

export async function register() {
  console.log("처음 실행!!");

  const schedule = require("node-schedule");

  // 매일 12시 마다
  schedule.scheduleJob("00 * * * * *", () => {
    try {
      console.log("schedule is executed");
      GET();
    } catch (e) {
      console.log("schedule 중 오류발생", e);
    }
  });
}
