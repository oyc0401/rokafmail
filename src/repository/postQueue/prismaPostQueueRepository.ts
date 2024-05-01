import prisma from "src/db/prisma";


export class PrismaPostQueueRepository {

  insert = (data: { postId: number; userId: number }) =>
    prisma.postQueue.create({ data });

  findAll = () =>
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


  deleteById = (id: number) =>
    prisma.postQueue.delete({
      where: {
        id
      }
    });
}
