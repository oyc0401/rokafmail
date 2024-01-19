import { NextResponse } from "next/server";

import { getNow } from "src/lib/time";
import { PrismaClient } from "@prisma/client";
import { User, UserQueue } from "src/db";
import { verifyUser } from "src/app/api/retry/verifyUser";

const prisma = new PrismaClient();

export async function GET() {
  console.log("start test", getNow());

  await verifyUserTest();

  return NextResponse.json({ message: "테스트 성공" }, { status: 200 });
}

async function verifyUserTest() {
  // 더미 미인증 유저 제작
  const dummyUser = await User.insert({
    username: "dasd",
    password: "password",
    name: "오유찬",
    birth: "20030401",
    generation: 850,
    message: `I am test`,
  });

  await UserQueue.insert({ userId: dummyUser.id });

  // 실행
  await verifyUser();

  // 끝나면 지우기
  console.log(dummyUser.id)
  await User.deleteById(dummyUser.id);
}
