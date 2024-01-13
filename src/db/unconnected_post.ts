import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class UnconnectedPost {
  static insert = ({ postId, userId }) =>
    prisma.unconnectedPost.create({
      data: {
        postId: postId,
        userId: userId,
      },
    });

  static findByUsername = (username: string) =>
    prisma.unconnectedPost.findMany({
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

  static findByUserId = (userId:number) =>
    prisma.unconnectedPost.findMany({
      where: {
        userId,
      },
    });

  static deleteByUserId = (userId: number) =>
    prisma.unconnectedPost.deleteMany({
      where: {
        userId,
      },
    });
}
