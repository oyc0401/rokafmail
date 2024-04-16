import prisma from "./prisma";

export class PostQueue {
  static insert = (data: { postId: number; userId: number }) =>
    prisma.postQueue.create({ data });

  static insertMany = (data: { postId: number; userId: number }[]) =>
    prisma.postQueue.createMany({ data });

  static findAll = () =>
    prisma.postQueue.findMany({
      where: {
        user: {
          NOT: {
            sodae: null,
            memberSeq: null,
          },
        },
      },
      include: {
        user: false,
        post: {
          include: {
            user: {
              select: {
                username: true,
                generation: true,
                memberSeq: true,
                sodae: true,
                id: true,
              },
            },
          }
        }
      },
    });


 



}
