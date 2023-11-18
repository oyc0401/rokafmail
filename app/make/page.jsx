'use client';

import React, { useRef } from 'react';
import axios from "axios";
import { useRouter } from 'next/navigation'


export default function make() {
  const router = useRouter();
  
  const name = useRef("");
  const year = useRef("");
  const month = useRef("");
  const date = useRef("");
  
  const handleSubmit = async () => {
    alert("이름: "+name.current);
  }
    return (
      <>
     
        <h1>링크 만들기</h1>
        <p>전송 후 아래의 '편지 목록' 버튼을 눌러 편지가 잘 전달되었는 지 확인하시기 바랍니다.</p>
        
        <br />
        <div>
          <input minLength="1" name="name" id="name" type="text" placeholder='이름' 
          required style={{"width": "235px"}}
          onChange={(e) => { name.current = e.target.value; }}></input>
          <br/>
          <input minLength="1" name="year" id="year" type="text" placeholder='년도' 
          required style={{"width": "80px","margin-right": "10px"}}
          onChange={(e) => { year.current = e.target.value; }}></input>
          <input minLength="1" name="month" id="month" type="text" placeholder='월' 
          required style={{"width": "80px","margin-right": "10px"}}
          onChange={(e) => { month.current = e.target.value; }}></input>
          <input minLength="1" name="date" id="date" type="text" placeholder='일' 
          required style={{"width": "80px"}}
          onChange={(e) => { date.current = e.target.value; }}></input>
          <br/>
          <button onClick={handleSubmit}>
            전송
          </button>
        </div>
       
       
      </>
    )
}