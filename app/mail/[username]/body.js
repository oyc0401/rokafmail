"use client";
import TextareaAutosize from "react-textarea-autosize";
import styles from "./mail.module.css";
import axios from "axios";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export function Body(params) {
  const name = useRef();
  const relationship = useRef();
  const title = useRef();
  const contents = useRef();
  const password = useRef();

  async function click() {
    await params.click();
  }

  const router = useRouter();

  const [progress, setProgress] = useState(false);

  const [validName, setValidName] = useState(false);
  const [validRelationship, setValidRelationship] = useState(false);
  const [validTitle, setValidTitle] = useState(false);
  const [validContents, setValidContents] = useState(false);
  const [validPassword, setValidPassword] = useState(false);

  const [nameHelp, setNameHelp] = useState({
    text: "",
  });
  const [relationshipHelp, setRelationshipHelp] = useState({
    text: "",
  });
  const [titleHelp, setTitleHelp] = useState({
    text: "",
  });
  const [contentsHelp, setContentsHelp] = useState({
    text: "",
  });
  const [passwordHelp, setPasswordHelp] = useState({
    text: "수정 및 삭제를 위한 비밀번호를 작성해주세요",
  });

  function editName(text) {
    name.current = text;

    // 빈칸일 때
    if (text == "") {
      setValidName(false);
      setNameHelp({
        text: "",
      });
      return;
    }

    // 통과
    setNameHelp({
      text: "잘했어요!",
      color: "great",
    });
    setValidName(true);
  }

  function editRelationship(text) {
    relationship.current = text;

    // 빈칸일 때
    if (text == "") {
      setValidRelationship(false);
      setRelationshipHelp({
        text: "",
      });
      return;
    }

    // 통과
    setRelationshipHelp({
      text: "잘했어요!",
      color: "great",
    });
    setValidRelationship(true);
  }

  function editTitle(text) {
    title.current = text;

    // 빈칸일 때
    if (text == "") {
      setValidTitle(false);
      setTitleHelp({
        text: "",
      });
      return;
    }

    // 통과
    setTitleHelp({
      text: "잘했어요!",
      color: "great",
    });
    setValidTitle(true);
  }

  function editContents(text) {
    contents.current = text;

    // 빈칸일 때
    if (text == "") {
      setValidContents(false);
      setContentsHelp({
        text: "",
      });
      return;
    }
    // 900자 이상
    if (text.length > 900) {
      setValidContents(false);
      setContentsHelp({
        text: "900자 이상을 입력할 수 없습니다.",
        color: "warn",
      });
      return;
    }

    // 통과
    setContentsHelp({
      text: "잘했어요!",
      color: "great",
    });
    setValidContents(true);
  }

  function editPassword(text) {
    password.current = text;

    // 빈칸일 때
    if (text == "") {
      setValidPassword(false);
      setPasswordHelp({
        text: "수정 및 삭제를 위한 비밀번호를 작성해주세요",
      });
      return;
    }

    // 통과
    setPasswordHelp({
      text: "잘했어요!",
      color: "great",
    });
    setValidPassword(true);
  }

  function canSubmit() {
    return (
      validName &&
      validRelationship &&
      validTitle &&
      validContents &&
      validPassword
    );
  }

  async function postMail() {
    setProgress(true);
    try {

      await axios.post("/api/mail", {
        username: params.username,
        name: name.current,
        relationship: relationship.current,
        title: title.current,
        contents: contents.current,
        password: password.current,
      });
      alert("편지 전송 성공!");

      router.push(`/res?sc=200`);
    } catch (e) {
      alert(e);
      setProgress(false);
    }
  }

  async function click() {
    if (canSubmit()) {
      postMail();
    } else {
      if (!validName) {
        setNameHelp({
          text: "이름을 입력해주세요",
          color: "warn",
        });
      }
      if (!validRelationship) {
        setRelationshipHelp({
          text: "관계를 입력해주세요",
          color: "warn",
        });
      }
      if (!validTitle) {
        setTitleHelp({
          text: "제목을 입력해주세요",
          color: "warn",
        });
      }
      if (!validContents) {
        setContentsHelp({
          text: "내용을 입력해주세요",
          color: "warn",
        });
      }
      if (!validPassword) {
        setPasswordHelp({
          text: "비밀번호를 입력해주세요",
          color: "warn",
        });
      }
    }
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
        <div className={styles.footer}>
          <div style={{ paddingLeft: 20, paddingRight: 20 }}>
            <div style={{ height: 12 }}></div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                justifyContent: "flex-start",
              }}
            >
              <button className={`submit ${styles.postsBtn}`}>편지함</button>
              <div style={{ width: 12 }}></div>
              <button
                className={canSubmit() ? "submit" : "submit disable"}
                onClick={click}
              >
                전송하기
              </button>
            </div>
          </div>
        </div>
        <div
          className={styles.registerLoad}
          style={{
            display: progress ? "flex" : "none",
          }}
        >
          <div className={`${styles.animation} ${styles.bigAnimation}`}></div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <div style={{ flex: "1" }}>
            <input
              className={`${styles.form}`}
              minLength="1"
              name="username"
              id="username"
              type="text"
              placeholder="보내는사람"
              onChange={(e) => {
                editName(e.target.value);
              }}
            ></input>
            <div style={{ height: 2 }}></div>
            <p className={`${styles.help} ${nameHelp.color}`}>
              {nameHelp.text}
            </p>
          </div>
          <div style={{ width: 34 }}></div>
          <div style={{ flex: "1" }}>
            <input
              className={`${styles.form}`}
              minLength="1"
              name="username"
              id="username"
              type="text"
              style={{ flex: "1" }}
              placeholder="관계"
              onChange={(e) => {
                editRelationship(e.target.value);
              }}
            ></input>
            <div style={{ height: 2 }}></div>
            <p className={`${styles.help} ${relationshipHelp.color}`}>
              {relationshipHelp.text}
            </p>
          </div>
        </div>

        <div style={{ height: 24 }}></div>
        <input
          className={styles.form}
          minLength="1"
          type="text"
          placeholder="제목"
          onChange={(e) => {
            editTitle(e.target.value);
          }}
        ></input>
        <div style={{ height: 2 }}></div>
        <p className={`${styles.help} ${titleHelp.color}`}>{titleHelp.text}</p>

        <div style={{ height: 24 }}></div>

        <TextareaAutosize
          className={`${styles.form} ${styles.contentForm}`}
          placeholder="내용"
          onChange={(e) => {
            editContents(e.target.value);
          }}
        ></TextareaAutosize>
        <div style={{ height: 2 }}></div>
        <p className={`${styles.help} ${contentsHelp.color}`}>
          {contentsHelp.text}
        </p>
        <div style={{ height: 18 }}></div>
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
            editPassword(e.target.value);
          }}
        ></input>
        <div style={{ height: 2 }}></div>
        <p className={`${styles.help} ${passwordHelp.color}`}>
          {passwordHelp.text}
        </p>
        <div style={{ height: 10 }}></div>
        <div style={{ height: 104 }}></div>
      </div>
    </>
  );
}
