import prisma from "./_prisma";

export class Post {
  static insert = (data: {
    userId: number;
    name: string;
    relationship: string;
    title: string;
    contents: string;
    password: string;
  }) => prisma.post.create({ data });

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
}
