import { NextResponse } from "next/server";

import { traversePostQueue } from "../traversePostQueue";
import { getNow } from "src/lib/time";
import { makeLogger } from "config/winston";
const logger = makeLogger("Retry Mail");

export async function GET() {
  logger.info("Start");

  if (process.env.NODE_ENV != "production") {
    run();
  }

  return NextResponse.json({ message: `Retry Mail 성공 ${getNow()}` }, { status: 200 });
}

async function run() {
  await traversePostQueue();
}
