import fs from 'fs';
import zlib from 'zlib';
import path from 'path';
import util from 'util';
import Link from 'next/link';

// 회원가입 정보 추출 함수
function extractRegisterInfo(line) {
  const regex = /\[Register\]\s+(\w+)\s+\((\d+)\)/;
  const match = regex.exec(line);
  if (!match) {
    return null;
  }

 

  const id = match[2];
  const time = new Date(line.split(" - ")[0]);
  return { id, time };
}

export default async function Page({params}){
  const logAddress = `./logs/${params.file}`;
  const data = await readFileAndDecompress(logAddress);

  const lines = data.split("\n");
  const registerInfos = lines
    .map((line) => extractRegisterInfo(line))
    .filter((info) => info !== null);
  
  // 회원가입 정보 JSON 변환
  const jsonData = registerInfos.reduce((acc, info:{ id, time }) => {
    acc[info.id] = info.time.toISOString();
    return acc;
  }, {});

  // JSON 출력
  const json=(JSON.stringify(jsonData, null, 2));
  
  return <>
    <Link  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" href='/admin/log'>Logs</Link>
    <article className='mt-6 p-4 bg-gray-100 '>
       <p className='whitespace-pre-wrap text-left'>{data}</p>
    </article>
    <article>
       <p className='whitespace-pre-wrap text-left'>{json}</p>
    </article>
   
  </>;


  
}

const gunzip = util.promisify(zlib.gunzip);

async function readFileAndDecompress(filePath) {
    try {
        // 파일 경로가 .gz로 끝나는지 확인
        if (filePath.endsWith('.gz')) {
            // 파일 읽기
            const compressedData = fs.readFileSync(filePath)
            // 압축 해제
            const decompressedData = await gunzip(compressedData);
            // 압축 해제된 데이터를 문자열로 변환하여 반환
            return decompressedData.toString();
        } else {
            // 압축되지 않은 파일의 경우, 직접 파일을 읽어서 반환
            const data =  fs.readFileSync(filePath, {encoding: 'utf8',flag:'r'});
            return data;
        }
    } catch (error) {
        console.error('An error occurred:', error);
        throw error; // 에러를 다시 던져서 함수를 호출한 곳에서 처리할 수 있도록 함
    }
}
