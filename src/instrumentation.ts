export async function register() {
  console.log("처음 실행!!");

  const schedule = require("node-schedule");

  // 매일 12시 마다
  schedule.scheduleJob("00 00 */4 * * *", () => {
    try {
      console.log("schedule is executed");
      const domain =
        "aa46348c-fadc-4dcc-af32-e878e8df23f8-00-2jam61sxcz2ou.pike.replit.dev";
      const url = `https://${domain}/api/retry`;
      
      fetch(url, { method: "GET" }).catch((error) => {
        console.error("Error:", error);
      });
      
    } catch (e) {
      console.log("schedule 중 오류발생", e);
    }
  });
}
