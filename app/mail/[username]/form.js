'use client'
import TextareaAutosize from "react-textarea-autosize";
import styles from "./mail.module.css";
export function Form(){



  return <>
  <div
    style={{
      display: "flex",
      // height: "100%",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      paddingLeft: "20px",
      paddingRight: "20px",
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
          editUsername(e.target.value);
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
          editUsername(e.target.value);
        }}
      ></input>
    </div>

    <div style={{ height: 26 }}></div>
    <input
      className={styles.form}
      minLength="1"
      type="text"
      placeholder="제목"
      onChange={(e) => {}}
    ></input>
    <div style={{ height: 26 }}></div>
    <TextareaAutosize
      className={styles.contentForm}
      placeholder="내용"
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
      onChange={(e) => {}}
    ></input>
    <div style={{ height: 2 }}></div>
    <div className={styles.formHint}>
      수정 및 삭제를 위한 비밀번호를 작성해주세요
    </div>

    <div style={{ height: 24 }}></div>
    <button className={"submit"}>전송하기</button>
    <div style={{ height: 32 }}></div>
  </div></>
}