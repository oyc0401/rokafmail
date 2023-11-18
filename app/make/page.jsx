'use client';

import React, { useRef, useState } from 'react';
import axios from "axios";
import { useRouter } from 'next/navigation'


export default function make() {
  const router = useRouter();

  const name = useRef("");
  const year = useRef("");
  const month = useRef("");
  const date = useRef("");
  const [mailLink, setMailLink] = useState("");

  const handleSubmit = async () => {
    setMailLink("로딩중...");

    axios.get('/api/profile', {
      params: {
        searchName: name.current,
        searchBirth: `${year.current}${month.current}${date.current}`
      }
    })
      .then(function(response) {
        let data = response.data;

        let link = `https://airforce-mail-maker/mail?searchName=${name.current}&memberSeqVal=${data.memberSeqVal}&sodaeVal=${data.sodaeVal}`;
        setMailLink(link);
      })
      .catch(function(error) {
        alert("오류:", error);
      })
      .finally(function() {
        // 항상 실행되는 영역
      });

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
          전송
        </button>
      </div>


    </>
  )
}