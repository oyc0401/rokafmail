// export async function register() {
//   console.log("처음 실행!!");

//   await sleep(30000);
//   const domain = process.env.domain;
//   // const domain = "aa46348c-fadc-4dcc-af32-e878e8df23f8-00-2jam61sxcz2ou.pike.replit.dev";
//   const url = `https://${domain}/api/cron`;

//    console.log("POST!!");
//   fetch(url, { method: "POST" }).catch((error) => {
//     console.error("Error:", error);
//   });
// }
const sleep = (delay: number) =>
  new Promise((resolve) => setTimeout(resolve, delay));
export async function register() {
  console.log("처음 실행!!");

  if (process.env.NODE_ENV == "production") {
    execute();
  }
}

async function execute() {
  console.log("schedule post wait...");
  await sleep(10000);
  console.log("schedule post");
  try {
    const domain = process.env.DOMAIN;
    //const domain = "aa46348c-fadc-4dcc-af32-e878e8df23f8-00-2jam61sxcz2ou.pike.replit.dev";
    const url = `https://${domain}/api/repeat`;
    fetch(url, { method: "POST" }).catch((error) => {
      console.error("Error:", error);
    });
  } catch (e) {
    console.log("schedule post 중 오류발생", e);
  }
}
