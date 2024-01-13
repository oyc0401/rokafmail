import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

  static updateMember = ({ id, memberSeq, sodae, connect }) =>
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
}
