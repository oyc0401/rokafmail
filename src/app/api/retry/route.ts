import { NextResponse } from "next/server";

import { verifyUser } from "./verifyUser";
import { repostMail } from "./repostMail";

export async function GET() {
  console.log("반복 실행: retry");

  verifyUser();
  repostMail();

  return NextResponse.json({ message: "회원가입 성공" }, { status: 200 });
}
