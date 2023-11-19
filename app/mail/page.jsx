'use client';

import React, { useRef, useEffect } from 'react';
import axios from "axios";
import { useRouter, useSearchParams } from 'next/navigation'
import airForceTime from './time';

// /mail?generation=852&searchName=곽희근&searchBirth=19950824
export default function validate() {
   const router = useRouter();
  
  const params = useSearchParams();
  const searchName = params.get('searchName');
  const searchBirth = params.get('searchBirth');
   const generation = params.get('generation');

  const [complete, setComplete] = React.useState(false);
  const [validate, setValidate] = React.useState(true);

  const memberSeqVal = useRef("");
  const sodaeVal = useRef("");

  useEffect(() => {
    console.log("서버요청!")
    fetchData();
  }, []);

  // 공군 인편 사이트에서 개인정보 가져오기
  function fetchData() {
    axios.get('/api/profile', {
      params: {
        searchName: searchName,
        searchBirth: searchBirth
      }
    })
      .then(function(response) {
        let data = response.data;
        memberSeqVal.current = data.memberSeqVal;
        sodaeVal.current = data.sodaeVal;

        setValidate(true);
      })
      .catch(function(error) {
        console.log("오류:", error);
        setValidate(false);
      }).finally(function() {
        setComplete(true);
      })
  }

  // 이름, 시간
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

    let [idayStr,sdayStr, jdayStr] = airForceTime(generation);

    const today = new Date();
    const iday = new Date(idayStr); // 입대일
    const sday = new Date(sdayStr); // 수료일
    const jday = new Date(jdayStr); // 전역일

    const ipdae = Math.ceil((iday) / (1000 * 60 * 60 * 24));
    const suryo = Math.ceil((sday - today) / (1000 * 60 * 60 * 24));
    const jeonyeok = Math.ceil((jday - today) / (1000 * 60 * 60 * 24));
    const percent = Math.ceil((today - iday) / (jday - iday) * 100);

    return (
      <div>
        <div>
          <h2>공군 {generation}기 훈련병 {searchName}</h2>
          <p style={{"margin": "0px"}}>{toStringByFormatting(iday)} ~ {toStringByFormatting(sday)}</p>
          <p style={{"margin": "0px"}}> 훈련소 수료까지 {suryo}일</p>
          {/* <p style={{"margin": "0px"}}>전역까지 {jeonyeok}일</p>
          <p style={{"margin": "0px"}}>지금까지 {percent}%</p> */}
          <br/>
        </div>
      </div>
    )
  }

  /// 편지 컴포넌트
  function Write(props){
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
        password: passwordRef.current,
        sodaeVal: sodaeVal.current,
        memberSeqVal: memberSeqVal.current
      }).then(
        (res) => {
          if (res.data === 200) {
            router.push(`/res?sc=200&generation=${generation}&searchName=${searchName}&searchBirth=${searchBirth}&memberSeqVal=${memberSeqVal.current}`);
          } else {
            router.push(`/res?sc=e&generation=${generation}&searchName=${searchName}&searchBirth=${searchBirth}&memberSeqVal=${memberSeqVal.current}`);
          }
        }
      )

     router.push(`/res?sc=200&generation=${generation}&searchName=${searchName}&searchBirth=${searchBirth}&memberSeqVal=${memberSeqVal.current}`);
    }

    return(
     <>
     <div>
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
       <a target="_blank" href={`https://www.airforce.mil.kr/user/indexSub.action?codyMenuSeq=156893223&siteId=last2&menuUIType=top&dum=dum&command2=getEmailList&searchName=${searchName}&searchBirth=${searchBirth}&memberSeq=${memberSeqVal.current}`}>
          편지 목록
        </a>
     </>
    )
  }


 

  // 로딩화면
  if (!complete) {
    return (
      <h1>{searchName} 훈련병 찾는중...</h1>
    );
  }

  // 편지쓰기 화면
  if (validate) {
    return (
    <> 
      <Timer></Timer>
      <Write></Write>
    </>
    );
  } 
  // 오류 화면
  else {
    return (
      <Error></Error>
    );
  }
}