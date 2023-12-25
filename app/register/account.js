"use client";
import React, { useRef, useState } from "react";
import styles from "./register.module.css";
import { avaliableUsername } from "./server/avaliableUsername";
import { useStore } from "./model";

export default function Account() {
  const username = useStore.use.username();
  const password = useStore.use.password();
  const repassword = useStore.use.repassword();

  const setUsername = useStore.use.setUsername();
  const setPassword = useStore.use.setPassword();
  const setRepassword = useStore.use.setRepassword();

  const next = useStore.use.next();
  const prev = useStore.use.prev();

  const clickUsernameDup = useRef(false);
  const [validUser, setValidUser] = useState(false);

  function editUsername(text) {
    setUsername(text);
    clickUsernameDup.current = false;
  }

  let [loading, setLoading] = useState(false);

  async function checkUsername() {
    if (loading) {
      return;
    }
    setLoading(true);

    setValidUser(await avaliableUsername(username));
    clickUsernameDup.current = true;
    setLoading(false);
  }

  function validU() {
    if (!clickUsernameDup.current) return { text: "", valid: false };

    if (validUser) {
      return {
        text: "사용할 수 있는 아이디입니다",
        color: "great",
        valid: true,
      };
    } else {
      return {
        text: "이미 사용중인 아이디 입니다",
        color: "warn",
        valid: false,
      };
    }
  }

  function validP() {
    // 수정한 비밀번호가 재확인 비밀번호와 같지 않을 때
    // 비밀번호 재확인 메시지를 초기화
    if (repassword.length != 0 && password != repassword)
      return { text: "비밀번호가 같지 않습니다.", color: "warn", valid: false };

    // 빈칸일 때
    if (repassword == "") return { text: "", valid: false };

    // 짧을 때
    if (repassword.length < 4)
      return {
        text: "비밀번호는 4자리 이상이여야 합니다",
        color: "warn",
        valid: false,
      };
    
    // 통과
    return { text: "잘했어요!", color: "great", valid: true };
  }

  function validR() {
    // 빈칸일 때
    if (repassword == "") return { text: "", valid: false };

    // 비밀번호가 같지 않음
    if (repassword != password)
      return { text: "비밀번호가 같지 않습니다", color: "warn", valid: false };

    // 통과
    return { text: "잘했어요!", color: "great", valid: true };
  }

  function canSubmit() {
    return validUser && validP().valid && validR().valid;
  }

  function click() {
    if (canSubmit()) {
      next();
    }
  }

  return (
    <>
      <div className="screen">
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
            width: "100%",
            justifyContent: "flex-start",
          }}
        >
          <input
            className={styles.form}
            value={username}
            type="text"
            style={{ flex: "1" }}
            placeholder="아이디를 입력해주세요"
            onChange={(e) => {
              editUsername(e.target.value);
            }}
          ></input>
          <button
            className={
              loading
                ? `${styles.dupButton} ${styles.loading}`
                : styles.dupButton
            }
            onClick={checkUsername}
          >
            <div
              style={{
                display: "flex",
                textAlign: "center",
                justifyContent: "center",
              }}
            >
              {loading ? <p className={styles.animation} /> : "중복확인"}
            </div>
          </button>
        </div>

        <div style={{ height: 2 }}></div>
        <p className={`${styles.help} ${validU().color}`}>{validU().text}</p>

        <div style={{ height: 16 }}></div>

        <p className={styles.formTitle}>비밀번호</p>
        <div style={{ height: 2 }}></div>
        <input
          className={styles.form}
          value={password}
          type="password"
          placeholder="비밀번호를 입력해주세요"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        ></input>
        <div style={{ height: 2 }}></div>
        <p className={`${styles.help} ${validP().color}`}>{validP().text}</p>

        <div style={{ height: 16 }}></div>

        <p className={styles.formTitle}>비밀번호 재확인</p>
        <div style={{ height: 2 }}></div>
        <input
          className={styles.form}
          value={repassword}
          type="password"
          placeholder="비밀번호를 다시 입력해주세요"
          onChange={(e) => {
            setRepassword(e.target.value);
          }}
        ></input>
        <div style={{ height: 2 }}></div>
        <p className={`${styles.help} ${validR().color}`}>{validR().text}</p>

        <div style={{ flex: 138 }}></div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            justifyContent: "flex-start",
          }}
        >
          <button className={`submit ${styles.prev}`} onClick={prev}>
            이전
          </button>
          <div style={{ width: 12 }}></div>
          <button
            className={canSubmit() ? "submit" : "submit disable"}
            onClick={click}
          >
            다음
          </button>
        </div>

        <div style={{ height: 37 }}></div>
      </div>
    </>
  );
}
