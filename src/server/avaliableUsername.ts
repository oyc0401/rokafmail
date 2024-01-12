"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function avaliableUsername(username) {
  console.log("아이디 중복확인 중...");
  const canUse =
    (await prisma.user.count({
      where: {
        username,
      },
    })) == 0;
  console.log("아이디 중복확인 완료!", canUse);

  return canUse;
}
