"use client";
import { useState } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import crypto from "crypto";
// import { setCookie } from "./cookie";
import { Nav } from "src/components";

export default function Client() {
  const [username, setUsername] = useState("");
  const [pw, setPw] = useState("");
  const [message, setMessage] = useState("");

  function validP() {
    // 빈칸일 때
    if (pw == "") return { text: "", valid: false };

    // 통과
    return { text: "", color: "great", valid: true };
  }

  function validU() {
    // 빈칸일 때
    if (username == "") return { text: "", valid: false };

    // 통과
    return { text: "", color: "great", valid: true };
  }

  function click() {
    if (!canSubmit()) return;
    const encryptedPassword = crypto
      .createHash("sha256")
      .update(pw)
      .digest("hex");
    if (encryptedPassword == password) {
      //setCookie(encryptedPassword, username);
    } else {
      setMessage("비밀번호가 틀렸습니다.");
    }
  }

  function canSubmit() {
    return validU().valid && validP().valid;
  }

  return (
    <>
      <div className="screen">
        <div style={{ flex: 64 }}></div>
        <div className="pt-12 pb-8 w-full">
          <h2 className={styles.title}>
            수료 후 편지함 확인을 위해
            <br />
            비밀번호를 설정해주세요
          </h2>
        </div>

        <div style={{ flex: 12 }}></div>

        <div className="pb-4 w-full">
          <p className={styles.formTitle}>아이디</p>
          <div style={{ height: 2 }}></div>
          <input
            className={styles.form}
            placeholder="아이디를 입력해주세요"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          ></input>
          <div style={{ height: 2 }}></div>
          <p className={`${styles.help} ${validU(username).color}`}>
            {validU(username).text}
          </p>
        </div>

        <div className="pb-4 w-full">
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
          <div style={{ height: 2 }}></div>
          <p className={`${styles.help} ${validP(pw).color}`}>
            {validP(pw).text}
          </p>
        </div>

        <div style={{ height: 95 + 16 }}></div>

        <div style={{ flex: 90 }}></div>
        <div className="pb-8 pt-6 w-full">
          <button
            className={canSubmit() ? "submit" : "submit disable"}
            onClick={click}
          >
            편지함 열기
          </button>
        </div>
      </div>
    </>
  );
}
