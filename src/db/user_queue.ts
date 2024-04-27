import prisma from "./prisma";

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
            generation: true,
            username: true,
          },
        },
      },
    });

  static findByUserId = async (userId: number) => {
    const result = await prisma.usersQueue.findMany({
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
      where: {
        userId
      }
    });

    if (result.length == 0) {
      return null;
    }
    if (result.length > 1) {
      throw Error(
        "UserQueue 안에 같은 userId를 가진 요소가 여러개 들어있습니다.",
      );
    }
    return result[0];
  };




  static deleteByUserId = (userId: number) =>
    prisma.usersQueue.deleteMany({
      where: { userId: userId },
    });

  static deleteById = (id: number) =>
    prisma.usersQueue.delete({
      where: { id },
    });
}
