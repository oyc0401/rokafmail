"use client";
import TextareaAutosize from "react-textarea-autosize";
import styles from "./mail.module.css";
import axios from "axios";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Nav } from "../../components/Nav";
import { useStore } from "./model";
import { relative } from "path";
import { validN, validR, validC, validT, validP } from "./valid";

export function Body(params) {
  const { name, relationship, title, contents, password } = useStore();

  async function click() {
    await params.click();
  }

  const router = useRouter();

  const [progress, setProgress] = useState(false);

  const [contentsLength, setContentsLength] = useState(0);

  const canSubmit = () =>
    validN(name).valid &&
    validR(relationship).valid &&
    validT(title).valid &&
    validC(contents).valid &&
    validP(password).valid;

  async function postMail() {
    setProgress(true);
    try {
      let data = await axios.post("/api/mail", {
        username: params.username,
        name: name,
        relationship: relationship,
        title: title,
        contents: contents,
        password: password,
      });
      //console.log(data);
      alert("편지 전송 성공!");

      router.push(`/complete/${params.username}?sc=200`);
    } catch (e) {
      alert(e);
      setProgress(false);
    }
  }

  async function click() {
    if (canSubmit()) postMail();
  }

  function Loading() {
    return (
      <div
        className={styles.registerLoad}
        style={{
          display: progress ? "flex" : "none",
        }}
      >
        <div className={`${styles.animation} ${styles.bigAnimation}`}></div>
      </div>
    );
  }

  return (
    <>
      <Post></Post>
      <Nav>
        <Link className={`submit mini`} href={`/mails/${params.username}`}>
          편지함
        </Link>
        <div style={{ width: 12 }}></div>
        <button
          className={canSubmit() ? "submit" : "submit disable"}
          onClick={click}
        >
          전송하기
        </button>
      </Nav>
      <Loading></Loading>
    </>
  );
}

function Post() {
  return (
    <div
      style={{
        background: "#FFFDF8",
        paddingTop: 10,
        paddingLeft: 20,
        paddingRight: 20,
      }}
    >
      <div style={{ width: "100%", padding: 16 }}>
        <div
          style={{
            background: "#B2A18F",
            width: 63,
            height: 26,
            margin: "auto",
          }}
        ></div>
      </div>

      <Title></Title>
      <Contents></Contents>
      <Name></Name>
      <Password></Password>
    </div>
  );
}



function Title() {
  const { title, setTitle } = useStore();
  return (
    <div className="pb-4">
      <input
        className={`${styles.form} ${styles.formTitle}`}
        type="text"
        placeholder="제목"
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      ></input>
    </div>
  );
}

function Contents() {
  const { contents, setContents } = useStore();

  return (
    <div className="pb-3">
      <TextareaAutosize
        className={`${styles.form} ${styles.contentForm}`}
        placeholder="내용"
        onChange={(e) => {
          setContents(e.target.value);
        }}
      ></TextareaAutosize>
      <div className="row pt-0.5">
        <p className={`${styles.help} ${validC(contents).color}`}>
          {validC(contents).text}
        </p>
        <div style={{ flex: 1 }}></div>
        <p className={`${styles.help}`}>{`${contents.length}/1200`}</p>
      </div>
    </div>
  );
}

function Name() {
  const { name, relationship, setName, setRelationship } = useStore();

  return (
    <div className="pb-6">
      <div className="row">
        <h2 className="text-lg" style={{color:'#37271A'}}>보내는 사람</h2>

        <div className="flex-1 pl-2.5">
          <input
            className={`${styles.form}`}
            type="text"
            placeholder="이름"
            onChange={(e) => {
              setName(e.target.value);
            }}
          ></input>
        </div>

        <div className="flex-1 pl-2.5">
          <input
            className={`${styles.form}`}
            type="text"
            style={{ flex: "1" }}
            placeholder="관계"
            onChange={(e) => {
              setRelationship(e.target.value);
            }}
          ></input>
        </div>
      </div>
    </div>
  );
}

function Password() {
  const { password, setPassword } = useStore();

  return (
    <>
      <input
        className={styles.form}
        type="password"
        placeholder="비밀번호"
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      ></input>
      <div className="sized" style={{ height: 2 }}></div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "flex-start",
        }}
      >
        <p className={`${styles.help} ${validP(password).color}`}>
          {validP(password).text}
        </p>
      </div>
    </>
  );
}
