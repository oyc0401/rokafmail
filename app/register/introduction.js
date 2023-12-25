"use client";
import React, { useRef, useState } from "react";
import styles from "./register.module.css";

export default function Substring(props) {
  const substring = props.substring;

  const [validIntro, setValidIntro] = useState(false);

  const [introHelp, setIntroHelp] = useState({
    text: "",
  });

  function editGeneration(text) {
    substring.current = text;

    // 빈칸일 때
    if (text == "") {
      setValidIntro(false);
      setIntroHelp({
        text: "",
      });
      return;
    }
    // 너무 많을 때
    if (50 < text.length) {
      setValidIntro(false);
      setIntroHelp({
        text: "글이 너무 길어요",
        color: "warn",
      });
      return;
    }

    // 통과
    setIntroHelp({
      text: "잘했어요!",
      color: "great",
    });
    setValidIntro(true);
  }

  function canSubmit() {
    return validIntro;
  }

  async function click() {
    if (canSubmit()) {
      setProgress(true);
      await props.click();
      setProgress(false);
    } else {
      if (!validIntro) {
        setIntroHelp({
          text: "한줄 글을 작성해주세요",
          color: "warn",
        });
      }
    }
  }

  const [progress, setProgress] = useState(false);

  return (
    <>
      <div className="screen">
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
          minLength="1"
          name="generation"
          id="generation"
          type="text"
          placeholder="한줄 글을 작성해주세요"
          onChange={(e) => {
            editGeneration(e.target.value);
          }}
        ></input>
        <div style={{ height: 2 }}></div>
        <p className={`${styles.help} ${introHelp.color}`}>{introHelp.text}</p>
        <div style={{ flex: 253 }}></div>

        <p className={styles.intro}>
          편지를 보내면 훈련병에게 실물로 된 편지가 도착합니다.
          <br />
          공군 기본군사훈련단은 훈련 3주차부터 인터넷편지 작성을 할 수 있습니다.
          따라서 이곳에서 보낸 편지들은 3주차 이후에 순차적으로 발송됩니다.
        </p>
        <div style={{ height: 24 }}></div>
        <button
          className={canSubmit() ? "submit" : "submit disable"}
          onClick={click}
        >
          만들기
        </button>
        <div style={{ height: 37 }}></div>
      </div>
    </>
  );
}
