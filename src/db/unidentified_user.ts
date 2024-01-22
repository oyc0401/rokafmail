import prisma from "./_prisma";

export class UnidentifiedUser {
  static insert = (data: { userId: number }) =>
    prisma.UnidentifiedUser.create({ data });

  static findAll = () =>
    prisma.usersQueue.findMany({
      include: {
        user: {
          select: {
            name: true,
            birth: true,
            sodae: true,
            memberSeq: true,
            generation:true,
            username:true,
          },
        },
      },
    });

  static deleteByUserId = (userId: number) =>
    prisma.usersQueue.deleteMany({
      where: { userId: userId },
    });
}
