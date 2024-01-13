"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function updatePostedTrue(postId: number) {
  return prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      posted: true,
      postAt: getNow(),
    },
  });
}

export async function getPost(username: string) {
  return await prisma.post.findMany({
    include: {
      user: {
        select: {
          username: true,
          connect: true,
        },
      },
    },
    where: {
      user: {
        username,
      },
      posted: true,
    },
  });
}

