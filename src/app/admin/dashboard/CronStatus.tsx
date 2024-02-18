'use client'
import { useRef, useState,useEffect } from 'react';
import {start,stop, status} from './dashboard_server'

import {CircularProgress} from "@nextui-org/react";

export default function CronStatus(){
  const [loading,setLoading]=useState(true);
   const [run,setRun] = useState(false);
  const [updated,setUpdated]=useState('loading');

  useEffect(() => {
   
      sync();
  }, []);

  async function sync() {
    setLoading(true);
    init();
    async function init(){
      const repeater =await status();
      setRun(repeater.running);
      if(repeater.lastUpdated){
        
         setUpdated(timeAgo(repeater.lastUpdated));
      }else{
         setUpdated('null');
      }
     setLoading(false);
    }
  }
  

  async function onclickStart() {
    await start(); // 프로그램 시작
    sync();
  }

  async function onclickStop() {
    await stop(); // 프로그램 중지
    sync();
  }

  function Status(){
    if(loading){
      return <div className='h-12'>
        <CircularProgress className='mx-auto' aria-label="Loading..."/>
      </div>
      
    }
    return <>
      <p id="programStatus" className={run ? "text-green-500" : "text-red-500"}>{run ? "Running" : "Stopped"}</p>
      <p id="programTimestamp" className="text-gray-600">{`Last updated: ${(updated)}`}</p>
    </>
  }

  return (

      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">

        <div className="mb-4 items-center">
          <h2 className="font-bold text-xl mb-2">Cron Status</h2>
          <Status></Status>
          

        </div>

        <div className="mb-4">
          <button onClick={onclickStart} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-4">
            Start
          </button>
          <button onClick={onclickStop} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Stop
          </button>
        </div>

      </div>
  );

}

function timeAgo(date: Date): string {
const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  return "Just now";
}