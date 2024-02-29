import prisma from "./prisma";

export class Post {
  static insert = (data: {
    userId: number;
    name: string;
    relationship: string;
    title: string;
    contents: string;
    password: string;
  }) => prisma.post.create({ data });

  static findById = (id: number) =>
    prisma.post.findUnique({
      where: {
        id,
      },
    });

  static findByUsername = (username: string) =>
    prisma.post.findMany({
      include: {
        user: {
          select: {
            username: true,
            connect: true,
            generation: true,
          },
        },
      },
      where: {
        user: {
          username,
        },
      },
    });

  static findAll = () =>
    prisma.post.findMany({
      include: {
        user: {
          select: {
            username: true,
            connect: true,
            generation: true,
          },
        },
      },
    });

  static findByUserId = (userId: number) =>
    prisma.post.findMany({
      where: {
        userId,
      },
    });

  /**
   * 어드민 페이지
   * 대상 유저아이디인 편지만 가져옵니다.
   **/
  static findByUserIdTable = (userId: number) =>
    prisma.post.findMany({
      include: {
        user: {
          select: {
            username: true,
            connect: true,
            generation: true,
          },
        },
      },
      where: {
        userId,
      },
    });

  static findAllTable = () =>
    prisma.post.findMany({
      select: {
        id: true,
        userId: true,
        name: true,
        relationship: true,
        title: true,
        // contents: true,
        // password: true,
        createdAt: true,
        posted: true,
        postAt: true,
      },
    });

  static findPostedByUsername = (username: string) =>
    prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            username: true,
            connect: true,
            generation: true,
          },
        },
      },
      where: {
        user: {
          username,
        },
        posted: true,
      },
    });

  static update = (
    id: number,
    data: {
      posted: boolean;
      postAt: Date;
    },
  ) =>
    prisma.post.update({
      where: {
        id,
      },
      data,
    });

  static deleteById = (id: number) =>
    prisma.post.delete({
      where: {
        id,
      },
    });

  static notPosts = () =>
    prisma.post.findMany({
      where: {
        posted: false,
        user: {
          connect: true,
        },
      },
    });
}
