'use client';
import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation'



export default function Register() {
  const router = useRouter();

  const name = useRef("");
  const generation = useRef("");
  const birth = useRef("");


  function validationName(){
    if (senderNameRef.current === "") {
      return false;
    }
  }


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



  
  return (
    <>
      <div className='flex' style={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: '20px',
        paddingRight: '20px',

      }}>



        <div style={{ flex: 100 }}></div>

        <h2>편지 주소를 확인하기 위해</h2>
        <h2>이름과 생년월일이 필요해요</h2>
        <div style={{ flex: 49 }}></div>



        <p className='inputTitle'>기수</p> 
        <div style={{ height: 2 }}></div>
        <input className='titledInput' minLength="1" name="generation" id="generation" type="text" onFocus={console.log("!")}
          placeholder='기수를 입력해주세요'
          onChange={(e) => { generation.current = e.target.value; }}></input>
        <div style={{ height: 2 }}></div>
        <p className='inputHint'>예시) 850</p>
        
        <div style={{ height: 16 }}></div>

        <p className='inputTitle'>이름</p>
        <div style={{ height: 2 }}></div>
        <input className='titledInput' minLength="1" name="name" id="name" type="text"
          placeholder='이름을 입력해주세요'
          onChange={(e) => { name.current = e.target.value; }}></input>
        <div style={{ height: 2 }}></div>
        <p className='inputHint'></p>
        
        <div style={{ height: 16 }}></div>

        <p className='inputTitle'>생년월일</p>
        <div style={{ height: 2 }}></div>
        <input className='titledInput' minLength="1" name="birth" id="birth" type="text"
          placeholder='생년월일 8자리를 입력해주세요'
          onChange={(e) => { birth.current = e.target.value; }}></input>
        <div style={{ height: 2 }}></div>
        <p className='inputHint'>예시) 20030401</p>
        
        <div style={{ height: 16 }}></div>
        
        
        <div style={{ flex: 138 }}></div>
        <div className='submit'>다음</div>

        <div style={{ height: 37 }}></div>
      </div>



    </>
  )
}