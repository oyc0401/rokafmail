import prisma from "src/db/prisma";


export class PrismaUserQueue {
  insert = (data: { userId: number }) =>
    prisma.usersQueue.create({ data });

  findAllWithUser = () =>
    prisma.usersQueue.findMany({
      include: {
        user: {
          select: {
            name: true,
            birth: true,
            sodae: true,
            memberSeq: true,
            generation: true,
            username: true,
            connect:true,
          },
        },
      },
    });

  deleteById = (id: number) =>
    prisma.usersQueue.deleteMany({
      where: { id },
    });

}
