"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 보내는데 성공한 편지를 보여줌
export async function getPost(username) {
  const posts = await prisma.post.findMany({
    select: {
      id: true,
      userId: true,
      name: true,
      relationship: true,
      title: true,
      contents: true,
      password: true,
      createdAt: true,
      posted: true,
      postAt: true,
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
    select: {
      id: true,
      userId: true,
      postId: true,
      user: {
        select: {
          username: true,
          connect: true,
        },
      },
      post: {
        select: {
          title: true,
          relationship: true,
          createdAt: true,
        },
      },
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
    select: {
      id: true,
      userId: true,
      postId: true,
      user: {
        select: {
          username: true,
          connect: true,
        },
      },
      post: {
        select: {
          title: true,
          relationship: true,
          createdAt: true,
        },
      },
    },
    where: {
      user: {
        username,
      },
    },
  });

  return unconnected;
}
