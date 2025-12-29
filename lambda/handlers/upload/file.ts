import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import AWS from 'aws-sdk';
import { ResponseHelper } from '../../libs/response';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

/**
 * 파일 업로드 핸들러
 *
 * 프론트엔드에서 파일을 base64로 인코딩하여 전송하면
 * S3에 업로드하고 파일명을 반환합니다.
 */
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body || '{}');
    const { files } = body; // files: [{ data: base64string, name: string, type: string }]

    if (!files || !Array.isArray(files)) {
      return ResponseHelper.badRequest('Files are required');
    }

    const uploadedFiles: string[] = [];

    for (const file of files) {
      const { data, name, type } = file;

      // base64 디코딩
      const buffer = Buffer.from(data, 'base64');

      // 파일 확장자 추출
      const fileExtension = name.split('.').pop();
      const newFileName = `images/${Date.now()}-${Math.floor(Math.random() * 10000)}.${fileExtension}`;

      // S3 업로드
      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: newFileName,
        Body: buffer,
        ContentType: type
      };

      await s3.upload(params).promise();
      uploadedFiles.push(newFileName);
    }

    return ResponseHelper.ok({ files: uploadedFiles });
  } catch (error) {
    console.error('Upload error:', error);
    return ResponseHelper.internalServerError(error.message);
  }
};
