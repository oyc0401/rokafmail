import imageCompression from 'browser-image-compression';


export async function resizeImage(file: File): Promise<File> {

  const options = {
    maxSizeMB: 0.5,  // 파일 크기 조정
    maxWidthOrHeight: 1440,  // 이미지의 최대 가로 또는 세로 크기
    useWebWorker: true,
    maxIteration: 10,  // 최대 반복 횟수 설정
    initialQuality: 0.8,  // 초기 이미지 품질 설정
    alwaysKeepResolution: true,  // 해상도를 유지하도록 설정
  };

  try {
    const compressedBlob = await imageCompression(file, options);
    const compressedFile = new File([compressedBlob], file.name, { type: file.type });
    return compressedFile;

  } catch (error) {
    console.error('Error compressing file:', error);
    return file;
  }

}

// async function resizeResizer(file: File): Promise<File> {
//   return new Promise((resolve, reject) => {
//     Resizer.imageFileResizer(
//       file,
//       300, // width
//       300, // height
//       'JPEG', // format
//       70, // quality
//       0, // rotation
//       (uri) => {
//         try {
//           // uri는 리사이즈된 이미지의 Blob 객체를 나타냅니다.
//           const resizedBlob = uri as Blob;
//           const resizedFile = new File([resizedBlob], file.name, { type: file.type });
//           resolve(resizedFile);
//         } catch (error) {
//           reject(error);
//         }
//       },
//       'blob' // output type
//     );
//   });
// }