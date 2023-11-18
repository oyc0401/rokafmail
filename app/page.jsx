'use client';

import React, { useRef } from 'react';
import axios from "axios";
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter();

  const senderNameRef = useRef("");
  const relationshipRef = useRef("");
  const titleRef = useRef("");
  const contentsRef = useRef("");
  const passwordRef = useRef("");

  const validation = () => {
    if (senderNameRef.current === "") {
      alert("이름을 입력해주세요.");
      return false;
    }
    if (relationshipRef.current === "") {
      alert("관계를 입력해주세요.");
      return false;
    }
    if (titleRef.current === "") {
      alert("제목을 입력해주세요.");
      return false;
    }
    if (contentsRef.current === "") {
      if (contentsRef.current.length > 1200) {
        alert("편지 내용은 1200자 이내로 작성해주세요.");
      } else {
        alert("편지 내용을 입력해주세요.");
      }
      return false;
    }
    if (passwordRef.current === "" || passwordRef.current.length < 4) {
      alert("비밀번호를 4자리 이상 입력해주세요.");
      return false;
    }

    return true;
  }

  const handleSubmit = async () => {
    if (!validation()) return;

    alert("전송 후 '편지 목록' 페이지를 눌러 편지가 잘 전달되었는 지 확인하시기 바랍니다.");

    axios.post('/api/send', {
      senderName: senderNameRef.current,
      relationship: relationshipRef.current,
      title: titleRef.current,
      contents: contentsRef.current,
      password: passwordRef.current
    }).then(
      (res) => {
        if (res.data === 200) {
          router.push("/res?sc=200");
        } else {
          router.push("/res?sc=e");
        }
      }
    )

  // router.push("/res?sc=200");
  }

  return (
    <>
      <div>
        <input minLength="1" name="senderName" id="senderName" type="text" placeholder='이름' 
          required style={{"margin-right": "10px"}}
          onChange={(e) => { senderNameRef.current = e.target.value; }}></input>
        <input minLength="1" name="relationship" id="relationship" type="text" placeholder='관계' 
          required
          onChange={(e) => { relationshipRef.current = e.target.value; }}></input>
        <br/>
        <input minLength="1" name="title" id="title" type="text" placeholder='제목' 
          required style={{"width": "235px"}}
          onChange={(e) => { titleRef.current = e.target.value; }}></input>
        <br/>
        <textarea placeholder='편지 내용' rows="5" cols="33"
          onChange={(e) => { contentsRef.current = e.target.value; }}>
        </textarea>
        <br/>
        <input minLength="4" name="password" id="password" type="text" placeholder="비밀번호" required style={{"margin-right": "10px"}}
        onChange={(e) => { passwordRef.current = e.target.value; }}/>
        <button onClick={handleSubmit}>
          전송
        </button>
      </div>

      <a target="_blank" href="https://www.airforce.mil.kr/user/indexSub.action?codyMenuSeq=156893223&siteId=last2&menuUIType=top&dum=dum&command2=getEmailList&searchName=%EC%98%A4%EC%9C%A0%EC%B0%AC&searchBirth=20030401&memberSeq=341457192">
        편지 목록
      </a>
    </>
  );
}