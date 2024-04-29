import prisma from "src/db/prisma";
import { PostRepository } from './postRepository';

export class PrismaPostRepository implements PostRepository {
  insert = (data: {
    userId: number;
    name: string;
    relationship: string;
    title: string;
    contents: string;
    password: string;
    isPublic: boolean;
  }) => prisma.post.create({ data });

  findById = (id: number) =>
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

  update = (
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



  findByIdWithUser = (id: number) =>
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


  updatePostedTrue = async (id: number) => {
    await prisma.post.update({
      where: { id },
      data: {
        posted: true,
        postAt: new Date(),
      },
    });

  }


}
