import prisma from "src/db/prisma";
import { PostRepository } from './postRepository';

export class PrismaPostRepository implements PostRepository {
  async insert(data: {
    userId: number;
    name: string;
    relationship: string;
    title: string;
    contents: string;
    password: string;
    isPublic: boolean;
  }) {
    return await prisma.post.create({ data });
  }



  async findById(id: number) {
    return await prisma.post.findUnique({
      where: { id },
    });
  }

  async findByIdWithUser(id: number) {
    return await prisma.post.findUnique({
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
      where: { id },
    });
  }

  update = (id: number, data) =>
    prisma.post.update({
      where: { id },
      data,
    });

  findNotPostedByUserId = (userId: number) =>
    prisma.post.findMany({
      where: {
        userId,
        posted: false,
      },
    });


}
