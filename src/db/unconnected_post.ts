"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function insertUnconnectedPost({ postId, userId }) {
  return prisma.unconnectedPost.create({
    data: {
      postId: postId,
      userId: userId,
    },
  });
}

export async function getUnconnectedPost(username: string) {
  return await prisma.unconnectedPost.findMany({
    include: {
      user: {
        select: {
          username: true,
          connect: true,
        },
      },
      post: true,
    },
    where: {
      user: {
        username,
      },
    },
  });
}
