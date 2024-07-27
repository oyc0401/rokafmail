import { NextResponse } from 'next/server';
import multer from 'multer';
import { promisify } from 'util';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadMiddleware = promisify(upload.array('files', 10)); // 최대 10개의 파일 업로드

export async function POST(request) {
  try {
    // Multer 미들웨어를 사용하여 파일을 처리합니다.
    await uploadMiddleware(request);

    const files = request.files;

    if (!files || files.length === 0) {
      return NextResponse.json({ message: 'No files uploaded' }, { status: 400 });
    }

    // 파일 정보들을 반환합니다.
    const fileDetails = files.map(file => ({
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    }));

    return NextResponse.json({
      message: 'Files uploaded successfully',
      files: fileDetails,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'File upload failed', error: error.message }, { status: 500 });
  }
}
