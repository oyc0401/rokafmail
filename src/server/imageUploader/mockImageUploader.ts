// MockImageUploader.ts
import { ImageUploader } from './imageUploader';

export class MockImageUploader implements ImageUploader {
  async uploadImage(file: File): Promise<string> {
    const mockPath = `mock/path/${file.name}`;
    console.log(`Mock upload successful: ${mockPath}`);
    return mockPath;
  }
}
