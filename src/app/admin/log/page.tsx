import fs from 'fs';
import zlib from 'zlib';
import path from 'path';
import Link from 'next/link';
import { promisify } from 'util';
import {LogsContainer} from './LogContainer'
export default async function Page(){

  const logDirectory = './logs'; // 로그 파일이 저장된 디렉토리 경로 지정
  
    const files = await getFiles(logDirectory); // 파일 목록 가져오기
  const list = groupLogsByDate(files);


  
 
  
  return <>
    logs
    <div>
      <LogsContainer logs={list} />
    </div>
  </>;
}



async function getFiles(logDirectory:string) {
  const readdirAsync = promisify(fs.readdir); // fs.readdir을 프로미스로 변환

  try {
    const files = await readdirAsync(logDirectory); // 비동기로 파일 목록을 읽습니다.
    return files; // 파일 목록 반환
  } catch (err) {
    throw new Error('파일을 읽는 중 오류가 발생했습니다.'); // 오류 처리
  }
}

function groupLogsByDate(files) {
  // 결과 객체 초기화
  const groupedLogs = {};

  // 파일 목록을 반복하며 처리
  files.forEach(file => {
    // JSON 파일과 error 폴더는 무시
    if (file.endsWith('.json') || file === 'error') {
      return;
    }

    // 파일명에서 날짜 부분 추출 (YYYY-MM-DD 형식 가정)
    const dateMatch = file.match(/\d{4}-\d{2}-\d{2}/);
    if (dateMatch) {
      const date = dateMatch[0];
      // 해당 날짜에 대한 배열이 없으면 초기화
      if (!groupedLogs[date]) {
        groupedLogs[date] = [];
      }
      // 해당 날짜 배열에 파일명 추가
      groupedLogs[date].push(file);
    }
  });

  return groupedLogs;
}