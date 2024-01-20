import { NextResponse } from "next/server";

import { verifyUser } from "./verifyUser";
import { repostMail } from "./repostMail";
import { getNow } from "src/lib/time";
import { logger } from "config/winston";

export async function GET() {
  console.log("start retry", getNow());
  logger.info("start retry");
  run();

  return NextResponse.json({ message: "retry 성공" }, { status: 200 });
}

async function run() {
  await verifyUser();
  await repostMail();
}
