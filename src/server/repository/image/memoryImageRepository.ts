// MemoryImageRepository.ts
import { ImageRepository, Image } from './imageRepository';

interface Image {
  postId: number;
  path: string;
}

export class MemoryImageRepository implements ImageRepository {
  private images: Image[] = [];

  async createImage(postId: number, path: string): Promise<void> {
    const newImage: Image = { postId, path };
    this.images.push(newImage);
  }

  async getImagesByPostId(postId: number): Promise<Image[]> {
    return this.images.filter(image => image.postId === postId);
  }

  // For testing purpose: Method to retrieve all images
  getAllImages(): Image[] {
    return this.images;
  }
}
