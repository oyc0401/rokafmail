"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class PostQueue{

  
}

export async function insertPostQueue({ postId, userId }) {
  return prisma.postQueue.create({
    data: {
      postId,
      userId,
    },
  });
}

export async function getPostQueueAll() {
  return prisma.postQueue.findMany({
    select: {
      id: true,
      userId: true,
      postId: true,
      user: {
        select: {
          username: true,
          memberSeq: true,
          sodae: true,
        },
      },
      post: {
        select: {
          name: true,
          relationship: true,
          title: true,
          contents: true,
          password: true,
        },
      },
    },
  });
}

export async function getPostQueue(username: string) {
  return await prisma.postQueue.findMany({
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


export async function deletePostQueue(postId) {
  await prisma.postQueue.deleteMany({
    where: {
      postId,
    },
  });

}