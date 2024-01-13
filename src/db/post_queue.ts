import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class PostQueue {
  static insert = ({ postId, userId }) =>
    prisma.postQueue.create({
      data: {
        postId,
        userId,
      },
    });

  static findAll = () =>
    prisma.postQueue.findMany({
      include: {
        user: {
          select: {
            username: true,
            memberSeq: true,
            sodae: true,
          },
        },
        post: true,
      },
    });

  static findByUsername = (username: string) =>
    prisma.postQueue.findMany({
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
