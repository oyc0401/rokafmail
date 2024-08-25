// S3ImageUploader.ts
import AWS from 'aws-sdk';
import { ImageUploader } from './imageUploader';

export class S3ImageUploader implements ImageUploader {
  private s3: AWS.S3;

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
  }

  async uploadImage(file: File): Promise<string> {
    const fileExtension = file.name.split('.').pop();
    const newFileName = `images/${Date.now()}-${Math.floor(Math.random() * 10000)}.${fileExtension}`;

    const buffer = await this.bufferFromBlob(file);
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: newFileName,
      Body: buffer,
      ContentType: file.type,
    };

    try {
      const result = await this.s3.upload(params).promise();
      console.log(`File uploaded successfully: ${result.Location}`);
      return result.Location;
    } catch (error) {
      console.error(`Error uploading file: ${file.name}`, error);
      throw error;
    }
  }

  private async bufferFromBlob(blob: Blob): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Uint8Array[] = [];
      const reader = blob.stream().getReader();

      function read() {
        reader.read().then(({ done, value }) => {
          if (done) {
            resolve(Buffer.concat(chunks));
            return;
          }
          chunks.push(value);
          read();
        }).catch(reject);
      }

      read();
    });
  }
}
