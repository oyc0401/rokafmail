"use client";
import React, { useRef, useState } from "react";

export default function Information(props) {
  const generation = useRef("");
  const name = useRef("");
  const birth = useRef("");

  const [validGeneration, setValidGeneration] = useState(false);
  const [validName, setValidName] = useState(false);
  const [validBirth, setValidBirth] = useState(false);

  const [generationHelp, setGenerationHelp] = useState({
    text: "예시) 850",
  });
  const [nameHelp, setNameHelp] = useState({
    text: "",
  });
  const [birthHelp, setBirthHelp] = useState({
    text: "예시) 20020101",
  });

  function editGeneration(text) {
    generation.current = text;

    // 빈칸일 때
    if (text == "") {
      setValidGeneration(false);
      setGenerationHelp({
        text: "예시) 850",
      });
      return;
    }
    // 숫자가 아닌 다른문자 입력
    if (!/^\d+$/.test(text)) {
      setValidGeneration(false);
      setGenerationHelp({
        text: "숫자만 입력해주세요",
        color: "warn",
      });
      return;
    }
    // 830 ~ 1000 밖의 기수일 때
    if (1000 < text) {
      setValidGeneration(false);
      setGenerationHelp({
        text: "숫자가 너무 커요",
        color: "warn",
      });
      return;
    }

    // 통과
    setGenerationHelp({
      text: "잘했어요!",
      color: "great",
    });
    setValidGeneration(true);
  }

  function editName(text) {
    name.current = text;

    // 빈칸일 때
    if (text == "") {
      setValidName(false);
      setNameHelp({
        text: "",
      });
      return;
    }

    // 통과
    setNameHelp({
      text: "잘했어요!",
      color: "great",
    });
    setValidName(true);
  }

  function editBirth(text) {
    birth.current = text;

    // 빈칸일 때
    if (text == "") {
        setValidBirth(false);
      setBirthHelp({
        text: "예시) 20020101",
      });
      return;
    }
    // 숫자가 아닌 문자 입력
    if (!/^\d+$/.test(text)) {
      setValidBirth(false);
      setBirthHelp({
        text: "숫자만 입력해주세요.",
        color: "warn",
      });
      return;
    }
    // 8자리 미만
    if (text.length < 8) {
        setValidBirth(false);
      setBirthHelp({
        text: "예시) 20020101",
      });
      return;
    }
    
    // 8자리 초과
    if (text.length > 8) {
      setValidBirth(false);
      setBirthHelp({
        text: "생년월일 8자리를 입력해주세요.",
        color: "warn",
      });
      return;
    }

    // 통과
    setValidBirth(true);
    setBirthHelp({
      text: "잘했어요!",
      color: "great",
    });
     
  }

  function canSubmit() {
    return validGeneration && validName && validBirth;
  }

  return (
    <>
      <div
        className="flex"
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingLeft: "20px",
          paddingRight: "20px",
        }}
      >
        <div style={{ flex: 100 }}></div>

         <h2 className={styles.title}>편지 주소를 확인하기 위해 이름과 생년월일이 필요해요</h2>
        <div style={{ flex: 49 }}></div>

        <p className={styles.formTitle}>기수</p>
        <div style={{ height: 2 }}></div>
        <input
          className={styles.form}
          minLength="1"
          name="generation"
          id="generation"
          type="text"
          placeholder="기수를 입력해주세요 예시) 850"
          onChange={(e) => {
            editGeneration(e.target.value);
          }}
        ></input>
        <div style={{ height: 2 }}></div>
        <p className={`${styles.help} ${generationHelp.color}`}>
          {generationHelp.text}
        </p>

        <div style={{ height: 16 }}></div>

        <p className={styles.formTitle}>이름</p>
        <div style={{ height: 2 }}></div>
        <input
          className={styles.form}
          minLength="1"
          name="name"
          id="name"
          type="text"
          placeholder="이름을 입력해주세요"
          onChange={(e) => {
            editName(e.target.value);
          }}
        ></input>
        <div style={{ height: 2 }}></div>
        <p className={`${styles.help} ${nameHelp.color}`}>{nameHelp.text}</p>

        
        <div style={{ height: 16 }}></div>

        
        <p className={styles.formTitle}>생년월일</p>
        <div style={{ height: 2 }}></div>
        <input
          className={styles.form}
          minLength="1"
          name="birth"
          id="birth"
          type="text"
          placeholder="생년월일 8자리를 입력해주세요"
          onChange={(e) => {
            editBirth(e.target.value);
          }}
        ></input>
        <div style={{ height: 2 }}></div>
        <p className={`${styles.help} ${birthHelp.color}`}>{birthHelp.text}</p>

      

        <div style={{ flex: 138 }}></div>
        <button
          className={canSubmit() ? "submit" : "submit disable"}
          onClick={props.click}
        >
          다음
        </button>
        <div style={{ height: 37 }}></div>
      </div>
    </>
  );
}
