'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation'


export default function Make() {
  const router = useRouter();

  const name = useRef("");
  const generation  = useRef("");
  const year = useRef("");
  const month = useRef("");
  const date = useRef("");
  const [mailLink, setMailLink] = useState("");

  const handleSubmit = async () => {

     console.log(router)
    let link = `https://airforce-mail.vercel.app/mail?generation=${generation.current}&searchName=${name.current}&searchBirth=${year.current}${month.current}${date.current}`;
    setMailLink(link);

  }

  return (
    <>

      <h1>링크 만들기</h1>
      <p> 편지 링크를 만듭니다.</p>

      <br />
      <div>
        <input minLength="1" name="name" id="name" type="text" placeholder='이름'
          required style={{ "width": "235px" }}
          onChange={(e) => { name.current = e.target.value; }}></input>
        <br />
        <input minLength="1" name="generation" id="generation" type="text" placeholder='기수'
        required style={{ "width": "235px" }}
        onChange={(e) => { generation.current = e.target.value; }}></input>
        <br />
        <input minLength="1" name="year" id="year" type="text" placeholder='년도'
          required style={{ "width": "80px", "margin-right": "10px" }}
          onChange={(e) => { year.current = e.target.value; }}></input>
        <input minLength="1" name="month" id="month" type="text" placeholder='월'
          required style={{ "width": "80px", "margin-right": "10px" }}
          onChange={(e) => { month.current = e.target.value; }}></input>
        <input minLength="1" name="date" id="date" type="text" placeholder='일'
          required style={{ "width": "80px" }}
          onChange={(e) => { date.current = e.target.value; }}></input>
        <br />
        <h1>{mailLink}</h1>

        <button onClick={handleSubmit}>
          링크 만들기
        </button>
      </div>


    </>
  )
}