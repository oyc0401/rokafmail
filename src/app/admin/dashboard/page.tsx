'use client'
import { useRef, useState,useEffect } from 'react';
import {start,stop, status} from './dashboard_server'
import CronStatus from './CronStatus'
export default function DashBoard(){

  return (
    <>
      <CronStatus></CronStatus>
    </>
  );
  
}