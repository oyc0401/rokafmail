import prisma from './prisma'

export class UnconnectedPost {
  static insert = (data: { postId: number; userId: number }) =>
    prisma.unconnectedPost.create({ data });

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

  static findByUserId = (userId: number) =>
    prisma.unconnectedPost.findMany({
      where: { userId },
    });

  static deleteByUserId = (userId: number) =>
    prisma.unconnectedPost.deleteMany({
      where: { userId },
    });
}
