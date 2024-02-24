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
        user: {
          select: {
            username: true,
            generation: true,
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

  static findByUserId = (userId: number) =>
    prisma.postQueue.findMany({
      include: {
        user: {
          select: {
            username: true,
            generation: true,
            memberSeq: true,
            sodae: true,
          },
        },
        post: true,
      },
      where: {
        userId,
      },
    });

  static findByPostId = async (postId: number) => {
    const result = await prisma.postQueue.findMany({
      include: {
        user: {
          select: {
            username: true,
            generation: true,
            memberSeq: true,
            sodae: true,
          },
        },
        post: true,
      },
      where: {
        postId,
      },
    });

    if (result.length == 0) {
      return null;
    }
    if (result.length > 1) {
      throw Error(
        "PostQueue 안에 같은 postId를 가진 요소가 여러개 들어있습니다.",
      );
    }
    return result[0];
  };

  static deleteByPostId = (postId: number) =>
    prisma.postQueue.deleteMany({
      where: {
        postId,
      },
    });
}
