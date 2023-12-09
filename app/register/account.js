"use client";
import React, { useRef, useState } from "react";
import styles from "./register.module.css";
import {avaliableUsername} from "./server/avaliableUsername";

export default function Account(props) {
  const username = props.username;
  const password = props.password;
  const repassword =props.repassword;

  const [validUsername, setValidUsername] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [validRepassword, setValidRepassword] = useState(false);

  const [usernameHelp, setUsernameHelp] = useState({
    text: "",
  });
  const [passwordHelp, setPasswordHelp] = useState({
    text: "",
  });
  const [repasswordHelp, setRepasswordHelp] = useState({
    text: "",
  });

  const clickUsernameDup = useRef(false);

  function editUsername(text) {
    username.current = text;
    clickUsernameDup.current = false;
    setValidUsername(false);
    setUsernameHelp({ text: "" });
  }

  async function checkUsername() {
    clickUsernameDup.current = true;

    let result = await avaliableUsername(username.current);
    
    if (result) {
      // 통과
      setValidUsername(true);
      setUsernameHelp({
        text: "사용할 수 있는 아이디입니다",
        color: "great",
      });
    } else {
      setValidUsername(false);
      setUsernameHelp({
        text: "이미 사용중인 아이디 입니다",
        color: "warn",
      });
    }
  }

  function editPassword(text) {
    password.current = text;

    // 수정한 비밀번호가 재확인 비밀번호와 같지 않을 때
    // 비밀번호 재확인 메시지를 초기화
    if (repassword.current.length != 0 && text != repassword.current) {
      setValidRepassword(false);
      setRepasswordHelp({
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
        text: "비밀번호는 4자리 이상이여야 합니다",
        color: "warn",
      });
      return;
    }

    // 변경한 비밀번호가 재확인 번호와 같을때
    if (repassword.current.length != 0 && text == repassword.current) {
      setValidRepassword(true);
      setRepasswordHelp({
        text: "잘했어요!",
        color: "great",
      });
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
      setRepasswordHelp({
        text: "",
      });
      return;
    }
    // 비밀번호가 같지 않음
    if (text != password.current) {
      setValidRepassword(false);
      setRepasswordHelp({
        text: "비밀번호가 같지 않습니다",
        color: "warn",
      });
      return;
    }

    // 통과
    setValidRepassword(true);
    setRepasswordHelp({
      text: "잘했어요!",
      color: "great",
    });
  }

  function canSubmit() {
    return validUsername && validPassword && validRepassword;
  }

  function click() {
    if (canSubmit()) {
      props.click();
    } else {
      if (!validUsername) {
        if (username.current.length != 0 && !clickUsernameDup.current) {
          setUsernameHelp({
            text: "아이디 중복확인을 해주세요",
            color: "warn",
          });
        } else if (username.current.length != 0 && clickUsernameDup.current) {
          setUsernameHelp({
            text: "이미 사용중인 아이디 입니다",
            color: "warn",
          });
        } else {
          setUsernameHelp({
            text: "아이디를 입력해주세요",
            color: "warn",
          });
        }
      }

      if (!validPassword) {
        setPasswordHelp({
          text: "비밀번호를 입력해주세요",
          color: "warn",
        });
      }
      if (!validRepassword) {
        setRepasswordHelp({
          text: "비밀번호를 다시 입력해주세요",
          color: "warn",
        });
      }
    }
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
          편지 주소를 확인하기 위해
          <br />
          이름과 생년월일이 필요해요
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
          onClick={click}
        >
          다음
        </button>
        <div style={{ height: 37 }}></div>
      </div>
    </>
  );
}
