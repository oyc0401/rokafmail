import prisma from "./prisma";

export class UnidentifiedUser {
  static insert = (data: { userId: number }) =>
    prisma.unidentifiedUser.create({ data });



  static findAll = () =>
    prisma.unidentifiedUser.findMany({
      include: {
        user: {
          select: {
            name: true,
            birth: true,
            sodae: true,
            memberSeq: true,
            generation: true,
            username: true,
          },
        },
      },
    });

  static findByUserId = (userId: number) =>
    prisma.unidentifiedUser.findMany({
      where: { userId: userId },
    });

  static deleteByUserId = (userId: number) =>
    prisma.unidentifiedUser.deleteMany({
      where: { userId: userId },
    });
}