import { NextResponse } from "next/server";

import { verifyUser } from "./verifyUser";
import { repostMail } from "./repostMail";
import { getNow } from "src/lib/time";

export async function GET() {
  console.log("start retry", getNow());

  run();

  return NextResponse.json({ message: "회원가입 성공" }, { status: 200 });
}

async function run() {
  await verifyUser();
  await repostMail();
}
