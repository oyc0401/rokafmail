"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 보내는데 성공한 편지를 보여줌
export async function getPost(username) {
  const posts = await prisma.post.findMany({
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

  return posts;
}

export async function getPostQueue(username) {
  const unconnected = await prisma.postQueue.findMany({
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

  return unconnected;
}

export async function getUnconnectedPost(username) {
  const unconnected = await prisma.unconnectedPost.findMany({
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

  return unconnected;
}
