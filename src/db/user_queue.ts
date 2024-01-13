import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class UserQueue {
  static insert = (data: { userId: number }) =>
    prisma.usersQueue.create({ data });

  static findAll = () =>
    prisma.usersQueue.findMany({
      include: {
        user: {
          select: {
            name: true,
            birth: true,
            sodae: true,
            memberSeq: true,
          },
        },
      },
    });

  static deleteByUserId = (userId: number) =>
    prisma.usersQueue.delete({
      where: { userId },
    });
}
