"use client";
import React, { useRef, useState } from "react";
import styles from "./register.module.css";

export default function Account(props) {
  const username = useRef("");
  const password = useRef("");
  const repassword = useRef("");

  const [validUsername, setValidUsername] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [validRepassword, setValidRepassword] = useState(false);

  const [usernameHelp, setUsernameHelp] = useState({
    text: "",
  });
  const [passwordHelp, setPasswordHelp] = useState({
    text: "",
  });
  const [repasswordHelp, setBirthRepassword] = useState({
    text: "",
  });

  function editUsername(text) {
    username.current = text;
    setValidUsername(false);
  }

  function checkUsername() {
    // 통과
    setValidUsername(true);
    setUsernameHelp({
      text: "잘했어요!",
      color: "great",
    });
  }

  function editPassword(text) {
    password.current = text;

    // 수정한 비밀번호가 재확인 비밀번호와 같지 않을 때
    // 비밀번호 재확인 메시지를 초기화
    if (repassword.current.length != 0 && text != repassword.current) {
      setValidRepassword(false);
      setBirthRepassword({
        text: "비밀번호가 같지 않습니다.",
        color: "warn",
      });
    }

    // 빈칸일 때
    if (text == "") {
      setValidPassword(false);
      setPasswordHelp({
        text: "",
      });
      return;
    }

    // 짧을 때
    if (text.length < 4) {
      setValidPassword(false);
      setPasswordHelp({
        text: "비밀번호는 4자리 이상이여야 합니다.",
        color: "warn",
      });
      return;
    }

    // 통과
    setPasswordHelp({
      text: "잘했어요!",
      color: "great",
    });
    setValidPassword(true);
  }

  function editRepassword(text) {
    repassword.current = text;

    // 빈칸일 때
    if (text == "") {
      setValidRepassword(false);
      setBirthRepassword({
        text: "",
      });
      return;
    }
    // 비밀번호가 같지 않음
    if (text != password.current) {
      setValidRepassword(false);
      setBirthRepassword({
        text: "비밀번호가 같지 않습니다.",
        color: "warn",
      });
      return;
    }

    // 통과
    setValidRepassword(true);
    setBirthRepassword({
      text: "잘했어요!",
      color: "great",
    });
  }

  function canSubmit() {
    return validUsername && validPassword && validRepassword;
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

        <h2 className={styles.title}>
          편지 주소를 확인하기 위해 이름과 생년월일이 필요해요
        </h2>

        <div style={{ flex: 49 }}></div>

        <p className={styles.formTitle}>아이디</p>
        <div style={{ height: 2 }}></div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <input
            className={`${styles.form} ${styles.username}`}
            minLength="1"
            name="username"
            id="username"
            type="text"
            style={{ flex: "1" }}
            placeholder="아이디를 입력해주세요"
            onChange={(e) => {
              editUsername(e.target.value);
            }}
          ></input>
          <button className={styles.dupButton} onClick={checkUsername}>
            중복확인
          </button>
        </div>

        <div style={{ height: 2 }}></div>
        <p className={`${styles.help} ${usernameHelp.color}`}>
          {usernameHelp.text}
        </p>

        <div style={{ height: 16 }}></div>

        <p className={styles.formTitle}>비밀번호</p>
        <div style={{ height: 2 }}></div>
        <input
          className={styles.form}
          minLength="1"
          name="password"
          id="password"
          type="password"
          placeholder="비밀번호를 입력해주세요"
          onChange={(e) => {
            editPassword(e.target.value);
          }}
        ></input>
        <div style={{ height: 2 }}></div>
        <p className={`${styles.help} ${passwordHelp.color}`}>
          {passwordHelp.text}
        </p>

        <div style={{ height: 16 }}></div>

        <p className={styles.formTitle}>비밀번호 재확인</p>
        <div style={{ height: 2 }}></div>
        <input
          className={styles.form}
          minLength="1"
          name="repassword"
          id="repassword"
          type="password"
          placeholder="비밀번호를 다시 입력해주세요"
          onChange={(e) => {
            editRepassword(e.target.value);
          }}
        ></input>
        <div style={{ height: 2 }}></div>
        <p className={`${styles.help} ${repasswordHelp.color}`}>
          {repasswordHelp.text}
        </p>

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
