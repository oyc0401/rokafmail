"use client";
import TextareaAutosize from "react-textarea-autosize";
import styles from "./mail.module.css";
import axios from "axios";
import { useRef } from "react";
import { useRouter } from 'next/navigation'

export function Form(params) {
  const name = useRef();
  const relationship = useRef();
  const title = useRef();
  const contents = useRef();
  const password = useRef();


   const router = useRouter();
  async function send() {
     await axios.post(
      "https://airforce-mail.oyc0401.repl.co/api/mail",
      {
        username:params.username,
        name: name.current,
        relationship: relationship.current,
        title: title.current,
        contents: contents.current,
        password: password.current,
      },
    );
    alert("편지 전송 성공!");

     router.push(`/res?sc=200`);
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          // height: "100%",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
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
            placeholder="보내는사람"
            onChange={(e) => {
              name.current=e.target.value;
            }}
          ></input>
          <div style={{ width: 34 }}></div>
          <input
            className={`${styles.form} ${styles.username}`}
            minLength="1"
            name="username"
            id="username"
            type="text"
            style={{ flex: "1" }}
            placeholder="관계"
            onChange={(e) => {
              relationship.current=e.target.value;
            }}
          ></input>
        </div>

        <div style={{ height: 26 }}></div>
        <input
          className={styles.form}
          minLength="1"
          type="text"
          placeholder="제목"
          onChange={(e) => {
            title.current=e.target.value;
          }}
        ></input>
        <div style={{ height: 26 }}></div>
        <TextareaAutosize
          className={styles.contentForm}
          placeholder="내용"
          onChange={(e) => {
            contents.current=e.target.value;
          }}
        ></TextareaAutosize>

        <div style={{ height: 24 }}></div>
        <div className={styles.description}>
          편지를 보내면 훈련병에게 실물로 된 편지가 도착합니다.
          <br />
          공군 기본군사훈련단은 훈련 3주차부터 인터넷편지 작성을 할 수 있습니다.
          따라서 이곳에서 보낸 편지들은 3주차 이후에 순차적으로 발송됩니다.
        </div>
        <div style={{ height: 24 }}></div>
        <input
          className={styles.form}
          minLength="1"
          type="password"
          placeholder="비밀번호"
          onChange={(e) => {
            password.current=e.target.value;
          }}
        ></input>
        <div style={{ height: 2 }}></div>
        <div className={styles.formHint}>
          수정 및 삭제를 위한 비밀번호를 작성해주세요
        </div>

        <div style={{ height: 24 }}></div>
        <button className={"submit"} onClick={send}>
          전송하기
        </button>
        <div style={{ height: 32 }}></div>
      </div>
    </>
  );
}
