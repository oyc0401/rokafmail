import prisma from './_prisma'

export class PostQueue {
  static insert = (data: { postId: number; userId: number }) =>
    prisma.postQueue.create({ data });

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

  static deleteByPostId = (postId: number) =>
    prisma.postQueue.deleteMany({
      where: {
        postId,
      },
    });
}
