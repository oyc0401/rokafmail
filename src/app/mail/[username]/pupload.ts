
import AWS from 'aws-sdk';

export default async function uploadFile(files: File[]) {

    const filenames: string[] = [];

    // 파일 업로드

    for (const file of files) {
        if (file instanceof File) {
            // 파일 확장자 추출
            const fileExtension = file.name.split('.').pop();
            const newFileName = `images/${Date.now()}-${Math.floor(Math.random() * 10000)}.${fileExtension}`;  // 새로운 파일 이름 설정 (임의의 숫자 사용)
            filenames.push(newFileName);
            asyncUpload(file, newFileName);
        }
    }

    return filenames;
}

async function asyncUpload(file, newFileName) {
    try {
        const result = await uploadToS3(file, newFileName);
        console.log(`File uploaded successfully: ${result.Location}`);
    } catch (error) {
        console.error(`Error uploading file: ${file.name}`, error);
    }
}

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

function bufferFromBlob(blob: Blob): Promise<Buffer> {
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

export async function uploadToS3(file: File, key: string) {
    const buffer = await bufferFromBlob(file);
    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: key,
        Body: buffer,
        ContentType: file.type,
    };

    // console.log(params)

    return s3.upload(params).promise();
}