"use client";
import React, { useState } from "react";
import styles from "./register.module.css";
import { useStore, useStoreBase } from "./model";
import { useRouter } from "next/navigation";
import axios from "axios";
import crypto from "crypto";
export default function Message() {
  const {
    generation,
    name,
    birth,
    username,
    password,
    message,
    setMessage,
    prev,
  } = useStoreBase();

  const [progress, setProgress] = useState(false);

  const router = useRouter();

  function validM() {
    // 빈칸일 때
    if (message == "") return { text: "", valid: false };

    // 너무 많을 때
    if (50 < message.length)
      return { text: "글이 너무 길어요", color: "warn", valid: false };

    // 통과
    return { text: "잘했어요!", color: "great", valid: true };
  }

  const canSubmit = () => validM().valid;

  async function send() {
    let encryptedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");
    try {
      await axios.post("/api/register", {
        username: username,
        password: encryptedPassword,
        name: name,
        birth: birth,
        generation: generation,
        substring: message,
      });
      router.push(`/link/${username}`);
    } catch (error) {
      console.log("오류:", error);
      alert("오류:", error);
    }
  }

  async function click() {
    if (canSubmit()) {
      setProgress(true);
      await send();
      setProgress(false);
    }
  }

  return (
    <>
   
        <div
          className={styles.registerLoad}
          style={{
            display: progress ? "flex" : "none",
          }}
        >
          <div className={`${styles.animation} ${styles.bigAnimation}`}></div>
        </div>
        <div style={{ flex: 100 }}></div>
        <h2 className={styles.title}>
          편지지에 보여질
          <br />
          한줄 글을 적어주세요
        </h2>
        <div style={{ flex: 49 }}></div>

        <p className={styles.formTitle}>한줄 글</p>
        <div style={{ height: 2 }}></div>
        <input
          className={styles.form}
          value={message}
          type="text"
          placeholder="한줄 글을 작성해주세요"
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        ></input>
        <div style={{ height: 2 }}></div>
        <p className={`${styles.help} ${validM().color}`}>{validM().text}</p>
        <div style={{ flex: 253 }}></div>

        <p className={styles.intro}>
          편지를 보내면 훈련병에게 실물로 된 편지가 도착합니다.
          <br />
          공군 기본군사훈련단은 훈련 3주차부터 인터넷편지 작성을 할 수 있습니다.
          따라서 이곳에서 보낸 편지들은 3주차 이후에 순차적으로 발송됩니다.
        </p>
        <div style={{ height: 24 }}></div>

        <div className="row">
          <button className={`submit mini`} onClick={prev}>
            이전
          </button>
          <div style={{ width: 12 }}></div>
          <button
            className={canSubmit() ? "submit" : "submit disable"}
            onClick={click}
          >
            만들기
          </button>
        </div>
        <div style={{ height: 36 }}></div>
   
    </>
  );
}
