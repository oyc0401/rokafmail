import prisma from "src/db/prisma";
import { PostRepository } from './postRepository';

export class PrismaPostRepository implements PostRepository {
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


  updatePostedTrue = (id: number) =>
    prisma.post.update({
      where: { id },
      data: {
        posted: true,
        postAt: new Date(),
      },
    });

}
