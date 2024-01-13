"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const insertUser = async (data: {
  username: string;
  password: string;
  name: string;
  birth: string;
  generation: number;
  message: string;
}) => prisma.user.create({ data });

export const getUser = async (username: string) =>
  prisma.user.findUnique({
    where: {
      username,
    },
  });

export const updateUserMember = async ({ id, memberSeq, sodae, connect }) =>
  prisma.user.update({
    where: {
      id,
    },
    data: {
      memberSeq,
      sodae,
      connect,
    },
  });

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
