import prisma from "./prisma";

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

  static findById = (id: number) =>
    prisma.user.findUnique({
      where: {
        id,
      },
    });

  static findAll = () => prisma.user.findMany({});

  // 어드민 페이지 User 테이블
  static findAllTable = () =>
    prisma.user.findMany({
      select: {
        id: true,
        username: true,
        // password: true,
        name: true,
        birth: true,
        generation: true,
        message: true,
        memberSeq: true,
        sodae: true,
        connect: true,
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

  static deleteByUsername = (username) =>
    prisma.user.delete({ where: { username: username } });

  static editProfile = ({ username, name, birth, message }) =>
    prisma.user.update({
      where: {
        username,
      },

      data: {
        name: name,
        birth: birth,
        message: message,
      },
    });

  static editPassword = ({ username, password }) =>
    prisma.user.update({
      where: {
        username,
      },

      data: {
        password: password,
      },
    });
}
