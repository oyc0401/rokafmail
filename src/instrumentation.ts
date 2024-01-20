export async function register() {
  console.log("처음 실행!!");

  //const domain = process.env.domain;
  const domain = "aa46348c-fadc-4dcc-af32-e878e8df23f8-00-2jam61sxcz2ou.pike.replit.dev";
  const url = `https://${domain}/api/cron`;

  fetch(url, { method: "POST" }).catch((error) => {
    console.error("Error:", error);
  });
}
