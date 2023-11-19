'use client';
import React, { useRef, useEffect } from 'react';
import axios from "axios";
import { useRouter, useSearchParams } from 'next/navigation'


function generation2Time(generation){
  let store = {
    852: ['2023/10/30 00:00:00', '2025/07/29 00:00:00'],
    853: ['2023/12/04 00:00:00', '2025/09/03 00:00:00'],
    854: ['2024/01/08 00:00:00', '2025/10/07 00:00:00'],
    855: ['2024/02/13 00:00:00', '2025/11/12 00:00:00'],
    856: ['2024/03/18 00:00:00', '2025/12/17 00:00:00'],
    857: ['2024/04/22 00:00:00', '2026/01/21 00:00:00'],
    858: ['2024/05/27 00:00:00', '2026/02/26 00:00:00'],
    859: ['2024/07/01 00:00:00', '2026/03/31 00:00:00'],
    860: ['2024/08/05 00:00:00', '2026/05/04 00:00:00'],
    861: ['2024/09/09 00:00:00', '2026/06/08 00:00:00'],
    862: ['2024/10/14 00:00:00', '2026/07/13 00:00:00'],
    863: ['2024/11/18 00:00:00', '2026/08/17 00:00:00'],
    864: ['2024/12/23 00:00:00', '2026/09/22 00:00:00'],
  };
 // let [idayStr, jddayStr] = store[generation];
  
  return store[generation];

}

export default  function Write(props){
    const senderNameRef = useRef("");
    const relationshipRef = useRef("");
    const titleRef = useRef("");
    const contentsRef = useRef("");
    const passwordRef = useRef("");


  console.log(props.memberSeqVal);
  console.log(props.sodaeVal);

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
        password: passwordRef.current,
        sodaeVal: props.sodaeVal,
        memberSeqVal: props.memberSeqVal
      }).then(
        (res) => {
          if (res.data === 200) {
            //router.push("/res?sc=200");
          } else {
           // router.push("/res?sc=e");
          }
        }
      )

     // router.push("/res?sc=200");
    }

  function Timer() {
    
    // date 포맷
    function toStringByFormatting(source, delimiter = '.') {
      function leftPad(value) {
        if (value >= 10) {
            return value;
        }

        return `0${value}`;
      }
      
      const year = source.getFullYear();
      const month = leftPad(source.getMonth() + 1);
      const day = leftPad(source.getDate());

      return [year, month, day].join(delimiter);
    }
    
    let generation = props.generation;
    let [idayStr, jdayStr] = generation2Time(generation);
    
    const today = new Date();
    const iday = new Date(idayStr); // 입대일
    const sday = new Date(idayStr); // 수료일
      sday.setDate(sday.getDate() + 32);
    const jday = new Date(jdayStr); // 전역일

    const ipdae = Math.ceil((iday) / (1000 * 60 * 60 * 24));
    const suryo = Math.ceil((sday - today) / (1000 * 60 * 60 * 24));
    const jeonyeok = Math.ceil((jday - today) / (1000 * 60 * 60 * 24));
    const percent = Math.ceil((today - iday) / (jday - iday) * 100);

    return (
      <div>
        <div>
          <h2>공군 {generation}기 훈련병 {props.searchName}</h2>
          <p style={{"margin": "0px"}}>{toStringByFormatting(iday)} ~ {toStringByFormatting(sday)}</p>
          <p style={{"margin": "0px"}}> 훈련소 수료까지 {suryo}일</p>
          {/* <p style={{"margin": "0px"}}>전역까지 {jeonyeok}일</p>
          <p style={{"margin": "0px"}}>지금까지 {percent}%</p> */}
          <br/>
        </div>
      </div>
    )
  }
  

    return(
     <>
     <div>
       <Timer></Timer>
       <input minLength="1" name="senderName" id="senderName" type="text" placeholder='이름' 
         required style={{"marginRight": "10px"}}
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
       <input minLength="4" name="password" id="password" type="text" placeholder="비밀번호" required style={{"marginRight": "10px"}}
       onChange={(e) => { passwordRef.current = e.target.value; }}/>
       <button onClick={handleSubmit}>
         전송
       </button>
     </div>

     <a target="_blank" href="https://www.airforce.mil.kr/user/indexSub.action?codyMenuSeq=156893223&siteId=last2&menuUIType=top&dum=dum&command2=getEmailList&searchName=%EC%98%A4%EC%9C%A0%EC%B0%AC&searchBirth=20030401&memberSeq=341457192">
       편지 목록
     </a></>
    )
  }

