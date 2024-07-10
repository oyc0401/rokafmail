export async function register() {
  console.log("처음 실행!!");

  if (process.env.NODE_ENV == "production") {
    execute();
  }
}

async function execute() {
  console.log("schedule post wait...");
  await sleep(30000);
  console.log("schedule post");
  try {
    const domain = process.env.DOMAIN;
    //const domain = "aa46348c-fadc-4dcc-af32-e878e8df23f8-00-2jam61sxcz2ou.pike.replit.dev";
    const url = `https://${domain}/api/retry/initialize`;
    const data = { key: process.env.NEXTAUTH_SECRET };

    fetch(url, { method: "POST", body: JSON.stringify(data) }).catch(
      (error) => {
        console.error("Error:", error);
      },
    );
  } catch (e) {
    console.log("schedule post 중 오류발생", e);
  }
}

const sleep = (delay: number) =>
  new Promise((resolve) => setTimeout(resolve, delay));