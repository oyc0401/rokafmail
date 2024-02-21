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
          },
        },
      },
      where: {
        user: {
          username,
        },
      },
    });

  static findAll = () => prisma.post.findMany();

  static findAllTable = () =>
    prisma.post.findMany({
      select: {
        id: true,
        userId: true,
        name: true,
        relationship: true,
        title: true,
        // contents: true,
        password: true,
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
}
