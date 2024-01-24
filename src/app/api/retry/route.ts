import { NextResponse } from "next/server";

import { verifyUser } from "./verifyUser";
import { repostMail } from "./repostMail";
import { getNow } from "src/lib/time";
import { makeLogger } from "config/winston";
const logger = makeLogger("retry");

export async function GET() {
  console.log('retry start')
   logger.info("retry start");
  run();

  return NextResponse.json({ message: `retry 성공 ${getNow()}`}, { status: 200 });
}

async function run() {
  await verifyUser();
  await repostMail();
}
