"use server";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


export async function getUser(username) {
  const result = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  
  return result;
}
