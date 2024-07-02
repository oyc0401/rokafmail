'use client'
import React from 'react';
import Link from 'next/link';

function LogButton({ filename }) {
  const isDebugLog = filename.endsWith('.debug.log');
  
  const buttonClass = isDebugLog
  ? "bg-gray-200 hover:bg-gray-700 text-black font-bold py-2 px-4 rounded m-2"
  : "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2";

  
  return (
    <Link className={buttonClass} href={`/admin/log/${filename}`}>
      {filename}
    </Link>
  );
}

export function LogsContainer({ logs }) {
    const sortedDates = Object.keys(logs).sort((a, b) => b.localeCompare(a));

    return (
      <div className="flex overflow-x-auto">
        {sortedDates.map(date => (
          <div key={date} className="flex-none w-64 m-4 bg-gray-100 text-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-bold">{date}</h2>
            <div className="flex flex-col">
              {
                // .log와 .debug.log 파일을 분리하여 정렬
                logs[date].sort((a, b) => {
                  const isADebug = a.endsWith('.debug.log');
                  const isBDebug = b.endsWith('.debug.log');
                  if (isADebug === isBDebug) return 0; // 둘 다 .log 또는 둘 다 .debug.log
                  if (isADebug) return 1; // A가 .debug.log면 B를 앞으로
                  return -1; // B가 .debug.log면 A를 앞으로
                }).map(filename => (
                  <LogButton key={filename} filename={filename} />
                ))
              }
            </div>
          </div>
        ))}
      </div>
    );
  }