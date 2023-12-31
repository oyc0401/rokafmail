"use client";
import React, { useRef, useState } from "react";
import styles from "./register.module.css";
import { avaliableUsername } from "./server/avaliableUsername";
import { useStore, useStoreBase } from "./model";

export default function Account() {
  const {
    username,
    password,
    repassword,
    setUsername,
    setPassword,
    setRepassword,
    next,
    prev,
  } = useStoreBase();

  const clickUsernameDup = useRef(false);
  const [validUser, setValidUser] = useState(false);

  let [loading, setLoading] = useState(false);

  function editUsername(text) {
    setUsername(text);
    clickUsernameDup.current = false;
    setValidUser(false);
  }

  async function checkUsername() {
    if (loading) return;
  
    setLoading(true);
    setValidUser(await avaliableUsername(username));
    clickUsernameDup.current = true;
    setLoading(false);
  }

  function validU() {
    if (!clickUsernameDup.current) return { text: "", valid: false };

    return validUser
      ? { text: "사용할 수 있는 아이디입니다,", color: "great", valid: true }
      : { text: "이미 사용중인 아이디 입니다", color: "warn", valid: false };
  }

  function validP() {
    // 빈칸일 때
    if (password == "") return { text: "", valid: false };

    // 짧을 때
    if (password.length < 4)
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

  const canSubmit = () => validUser && validP().valid && validR().valid;

  const click = () => {
    if (canSubmit()) next();
  };

  return (
    <>
      <div className="screen">
        <div style={{ flex: 100 }}></div>

        <h2 className={styles.title}>
          수료 후 편지함 확인을 위해
          <br />
          비밀번호를 설정해주세요
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

        <div style={{ height: 36 }}></div>
      </div>
    </>
  );
}
