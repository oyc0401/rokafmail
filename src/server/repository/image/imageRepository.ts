// ImageRepository.ts
export interface ImageRepository {
  createImage(postId: number, path: string): Promise<void>;
  getImagesByPostId(postId: number): Promise<Image[]>;
}

export interface Image {
  id: number;
  postId: number;
  path: string;
}