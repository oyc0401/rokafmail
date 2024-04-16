import prisma from "./prisma";

export class Post {
  static insert = (data: {
    userId: number;
    name: string;
    relationship: string;
    title: string;
    contents: string;
    password: string;
    isPublic: boolean;
  }) => prisma.post.create({ data });

  static findById = (id: number) =>
    prisma.post.findUnique({
      include: {
        user: {
          select: {
            username: true,
            connect: true,
            generation: true,
            memberSeq: true,
            sodae: true,
          },
        },
      },
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
  static findByUserIdNotPosted = (userId: number) =>
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
        posted: false,
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

  // desperate
  // 편지함 보여주기, id 오름차 순
  static findPostedByUsername = (username: string) =>
    prisma.post.findMany({
      orderBy: {
        id: "desc",
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


  /**
   * [/mails] 비공개 편지 가져오기
   * 
   */
  static findPrivateByUsername = (username: string) =>
    prisma.post.findMany({
      select: {
        id: true,
        userId: true,
        name: true,
        relationship: true,
        title: true,
        createdAt: true,
        posted: true,
        postAt: true,
        isPublic: true,
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
        isPublic: false,
        posted: true,
      },
    });


  /**
   * [/mails] 공개 편지 가져오기
   * 
   */
  static findPublicByUsername = (username: string) =>
    prisma.post.findMany({
      select: {
        id: true,
        userId: true,
        name: true,
        relationship: true,
        title: true,
        createdAt: true,
        posted: true,
        postAt: true,
        isPublic: true,
        contents: true,
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
        isPublic: true,
        posted: true,
      },
    });


  /**
   * [/mails] 비공개 미발송 편지 가져오기
   * 
   */
  static findPrivateNotPostedByUsername = (username: string) =>
    prisma.post.findMany({
      select: {
        id: true,
        userId: true,
        name: true,
        relationship: true,
        title: true,
        createdAt: true,
        posted: true,
        postAt: true,
        isPublic: true,
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
        isPublic: false,
        posted: false,
      },
    });


  /**
   * [/mails] 공개 미발송 편지 가져오기
   * 
   */
  static findPublicNotPostedByUsername = (username: string) =>
    prisma.post.findMany({
      select: {
        id: true,
        userId: true,
        name: true,
        relationship: true,
        title: true,
        createdAt: true,
        posted: true,
        postAt: true,
        isPublic: true,
        contents: true,
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
        isPublic: true,
        posted: false,
      },
    });

  static findPublicPostById = (id: number) =>
    prisma.post.findUnique({
      select: {
        id: true,
        userId: true,
        name: true,
        relationship: true,
        title: true,
        createdAt: true,
        posted: true,
        postAt: true,
        isPublic: true,
        contents: true,
        user: {
          select: {
            username: true,
            connect: true,
            generation: true,
          },
        },
      },
      where: {
        id,
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

  static edit = (
    id: number,
    data: {
      name: string;
      relationship: string;
      title: string;
      contents: string;
      password: string;
      isPublic: boolean;
    }
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

  static count = () => prisma.post.count();

  static generationCount = (generation) =>
    prisma.post.count({ where: { user: { generation } } });


  static findNotPostedByUserId = (userId: number) =>
    prisma.post.findMany({
      select: {
        id: true,
        userId: true,
        name: true,
        relationship: true,
        title: true,
        createdAt: true,
        posted: true,
        postAt: true,
        isPublic: true,
        contents: true,
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
        posted: false,
      },
    });
}
