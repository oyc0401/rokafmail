"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const insertUserQueue = async ({ userId }: { userId: number }) => {
  return prisma.usersQueue.create({
    data: {
      userId,
    },
  });
};
