import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class UserQueue {
  static insert = ({ userId }: { userId: number }) =>
    prisma.usersQueue.create({
      data: {
        userId,
      },
    });

  static deleteByUserId = (userId: number) =>
    prisma.usersQueue.delete({
      where: {
        id: userId,
      },
    });
}
