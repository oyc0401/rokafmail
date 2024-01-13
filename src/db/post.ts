import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class Post {
  static updatePostedTrue = (postId: number) =>
    prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        posted: true,
        postAt: getNow(),
      },
    });

  static findByUsername = (username: string) =>
    prisma.post.findMany({
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
