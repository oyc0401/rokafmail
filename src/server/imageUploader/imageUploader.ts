// ImageUploader.ts
export interface ImageUploader {
  uploadImage(file: File): Promise<string>;
}
