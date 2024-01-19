import prisma from "./_prisma";

export class User {
  static insert = (data: {
    username: string;
    password: string;
    name: string;
    birth: string;
    generation: number;
    message: string;
  }) => prisma.user.create({ data });

  static findByUsername = (username: string) =>
    prisma.user.findUnique({
      where: {
        username,
      },
    });

  static update = (
    id: number,
    {
      memberSeq,
      sodae,
      connect,
    }: { memberSeq: string; sodae: string; connect: boolean },
  ) =>
    prisma.user.update({
      where: {
        id,
      },
      data: {
        memberSeq,
        sodae,
        connect,
      },
    });

  static countUsername = (username: string) =>
    prisma.user.count({
      where: {
        username,
      },
    });

  static findByInfo = ({
    generation,
    name,
    birth,
  }: {
    generation: number;
    name: string;
    birth: string;
  }) =>
    prisma.user.findMany({
      where: {
        generation,
        name,
        birth,
      },
      select: {
        id: true,
        username: true,
        generation: true,
        name: true,
        birth: true,
        posts: {
          select: {
            id: true,
          },
        },
      },
    });

  static deleteById = (userId) => prisma.user.delete({ where: { id: userId } });
}
