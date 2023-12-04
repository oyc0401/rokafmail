'use client';
import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation'



export default function Register() {
  const router = useRouter();

  const generation = useRef("");
  const name = useRef("");
  const birth = useRef("");

  const [validGeneration, setValidGeneration] = useState(false);
  const [validName, setValidName] = useState(false);
  const [validBirth, setValidBirth] = useState(false);

  const [generationHelp, setGenerationHelp] = useState("");
  const [nameHelp, setNameHelp] = useState("");
  const [birthHelp, setBirthHelp] = useState("");

  const generationChanged = useRef(false);
  const nameChanged = useRef(false);
  const birthChanged = useRef(false);



  function editGeneration(text) {
    generation.current = text;
    generationChanged.current = true;
    if (generation.current == "") {
      setValidGeneration(false);
      setGenerationHelp("기수를 입력해주세요");
    } else {
      setValidGeneration(true);
    }
  }

  function editName(text) {
    name.current = text;
    nameChanged.current = true;
    if (name.current == "") {
      setValidName(false);
      setNameHelp("이름을 입력해주세요");
    } else {
      setValidName(true);
    }
  }

  function editBirth(text) {
    birth.current = text;
    birthChanged.current = true;
    if (birth.current == "") {
      setValidBirth(false);
      setBirthHelp("생년월일을 입력해주세요");
    }
    else if (!/^\d+$/.test(text)) {
      setValidBirth(false);
      setBirthHelp("숫자만 입력해주세요.");
    } else if (birth.current.length != 8) {
      setValidBirth(false);
      setBirthHelp("생년월일 8자리를 입력해주세요. 예시) 20030401");
    } else {
      // 성공
      setValidBirth(true);
    }
  }

  function canSubmit() {
    return validGeneration && validName && validBirth;
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
        <input className='titledInput' minLength="1" name="generation" id="generation" type="text"
          placeholder='기수를 입력해주세요 예시) 850'
          onChange={(e) => { editGeneration(e.target.value) }}></input>
        <div style={{ height: 2 }}></div>
        {validGeneration || !generationChanged.current
          ? <p className='inputHelp' >예시) 850 </p>
          : <p className='inputHelp warn' >{generationHelp}</p>}

        <div style={{ height: 16 }}></div>

        <p className='inputTitle'>이름</p>
        <div style={{ height: 2 }}></div>
        <input className='titledInput' minLength="1" name="name" id="name" type="text"
          placeholder='이름을 입력해주세요'
          onChange={(e) => { editName(e.target.value) }}></input>
        <div style={{ height: 2 }}></div>

        {validName || !nameChanged.current
          ? <p className='inputHelp' ></p>
          : <p className='inputHelp warn' >{nameHelp}</p>}

        <div style={{ height: 16 }}></div>

        <p className='inputTitle'>생년월일</p>
        <div style={{ height: 2 }}></div>
        <input className='titledInput' minLength="1" name="birth" id="birth" type="text"
          placeholder='생년월일 8자리를 입력해주세요'
          onChange={(e) => { editBirth(e.target.value) }}></input>
        <div style={{ height: 2 }}></div>
        {validBirth || !birthChanged.current
          ? <p className='inputHelp' >예시) 20030401</p>
          : <p className='inputHelp warn' >{birthHelp}</p>}

        <div style={{ flex: 138 }}></div>
        <button className={canSubmit() ? 'submit' : 'submit disable'}>다음</button>
        <div style={{ height: 37 }}></div>
      </div>



    </>
  )
}