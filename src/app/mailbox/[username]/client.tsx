"use client";
import { useState } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import crypto from "crypto";

export function Client({ password }) {
  const [pw, setPw] = useState("");
  const [valid, setValid] = useState(false);

  function click() {
    const encryptedPassword = crypto
      .createHash("sha256")
      .update(pw)
      .digest("hex");
    if (encryptedPassword == password) {
      setValid(true);
    }
  }
  if(valid){
    return <>편지 모두 보여주기!</>
  }

  return (
    <div className="screen">
      <h2 className={styles.title}>
        편지지에 보여질
        <br />
        한줄 글을 적어주세요
      </h2>

      <p className={styles.formTitle}>비밀번호</p>
      <div style={{ height: 2 }}></div>
      <input
        className={styles.form}
        type="password"
        placeholder="비밀번호를 입력해주세요"
        onChange={(e) => {
          setPw(e.target.value);
        }}
      ></input>

      <div style={{ paddingBottom: 32, width: "100%" }}>
        <button className="submit" onClick={click}>
          시작하기
        </button>
      </div>
    </div>
  );
}
