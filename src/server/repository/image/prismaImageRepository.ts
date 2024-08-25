// PrismaImageRepository.ts
import { PrismaClient } from '@prisma/client';
import { ImageRepository } from './imageRepository';

export class PrismaImageRepository implements ImageRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createImage(postId: number, path: string): Promise<void> {
    await this.prisma.image.create({
      data: {
        postId,
        path,
      },
    });
  }

  // Optionally, you can add more methods to interact with images, e.g., fetching images by postId
  async getImagesByPostId(postId: number) {
    return await this.prisma.image.findMany({
      where: { postId },
    });
  }
}
