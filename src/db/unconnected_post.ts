import prisma from './prisma'

export class UnconnectedPost {
  static insert = (data: { postId: number; userId: number }) =>
    prisma.unconnectedPost.create({ data });

  static findByUsername = (username: string) =>
    prisma.unconnectedPost.findMany({
      orderBy: {
        id: "asc",
      },
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

  /**
   * [/mails] 공개 편지 가져오기
   * 
   */
  static findPublicByUsername = (username: string) =>
    prisma.unconnectedPost.findMany({
      include: {
        user: {
          select: {
            username: true,
            connect: true,
          },
        },
        post: {
          select: {
            name: true,
            relationship: true,
            title: true,
            createdAt: true,
            posted: true,
            postAt: true,
            isPublic: true,
            contents:true,
          }
        }
      },
      where: {
        user: {
          username,
        },
        post: {
          isPublic: true,
        }
      },
    });


  /**
   * [/mails] 비공개 편지 가져오기
   * 
   */
  static findPrivateByUsername = (username: string) =>
  prisma.unconnectedPost.findMany({
    include: {
      user: {
        select: {
          username: true,
          connect: true,
        },
      },
      post: {
        select: {
          name: true,
          relationship: true,
          title: true,
          createdAt: true,
          posted: true,
          postAt: true,
          isPublic: true,
        }
      }
    },
    where: {
      user: {
        username,
      },
      post: {
        isPublic: false,
      }
    },
  });


  static findByUserId = (userId: number) =>
    prisma.unconnectedPost.findMany({
      where: { userId },
    });

  static deleteByUserId = (userId: number) =>
    prisma.unconnectedPost.deleteMany({
      where: { userId },
    });
}
