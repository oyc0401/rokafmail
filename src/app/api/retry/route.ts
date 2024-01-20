import { NextResponse } from "next/server";

import { verifyUser } from "./verifyUser";
import { repostMail } from "./repostMail";
import { getNow } from "src/lib/time";
import { useLogger } from "config/winston";
const logger = useLogger("retry");

export async function GET() {
  logger.info("start");
  run();

  return NextResponse.json({ message: "retry 성공" }, { status: 200 });
}

async function run() {
  await verifyUser();
  await repostMail();
}
