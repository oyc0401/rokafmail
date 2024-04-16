import { NextResponse } from "next/server";

import { verifyUser } from "../verifyUser";
import { sendAllMails } from "../mailQueue";
import { getNow } from "src/lib/time";
import { makeLogger } from "config/winston";
const logger = makeLogger("Retry All");

export async function GET() {
   logger.info("Start");

  if (process.env.NODE_ENV != "production") {
     run();
  }
  
  return NextResponse.json({ message: `Retry All 성공 ${getNow()}`}, { status: 200 });
}

async function run() {
  await verifyUser();
  await sendAllMails();
}
