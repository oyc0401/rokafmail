"use client";
import React, { useState } from "react";
import styles from "./page.module.css";

function Search() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function click() {}

  function canSubmit() {
    return true;
  }

  return (
    <>
      <div style={{ flex: 100 }}></div>
      <h2 className={styles.title}>
        편지 주소를 확인하기 위해
        <br />
        이름과 생년월일이 필요해요
      </h2>

      <div style={{ flex: 49 }}></div>

      <p className={styles.formTitle}>아이디</p>
      <div style={{ height: 2 }}></div>
      <input
        className={styles.form}
        type="text"
        placeholder="아이디를 입력해주세요"
        onChange={(e) => {
          setUsername(e.target.value);
        }}
      ></input>
      <div style={{ height: 16 }}></div>

      <p className={styles.formTitle}>이름</p>
      <div style={{ height: 2 }}></div>
      <input
        className={styles.form}
        type="text"
        placeholder="이름을 입력해주세요"
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      ></input>

      <div style={{ flex: 138 }}></div>
      <button
        className={canSubmit() ? "submit" : "submit disable"}
        onClick={click}
      >
        다음
      </button>
      <div style={{ height: 36 }}></div>
    </>
  );
}

export default Search;
