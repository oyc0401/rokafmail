"use client";
import { useEffect } from "react";
import styles from "./paper.module.css";
import { useStore } from "./model";
import { validC,validP } from "./valid";
import rokafLogo from "public/assets/rokaf.png";
import Image from "next/image";
import TextareaAutosize from 'react-textarea-autosize';
export function Paper() {
  const { initial } = useStore();
  useEffect(() => {
    initial();
    return () => {
      initial();
    };
  }, [initial]);

  
  return (
    <div
      className='px-4 py-2 bg-[#FFFDF8] shadow-md'
      style={{  }}
    >
      <div style={{ width: "100%", padding: 16 }}>
        <Image
          src={rokafLogo}
          alt="airforce"
          style={{
            width: 63,
            height: 26,
            margin: "auto",
          }}
        ></Image>
      </div>

      <Title></Title>
      <Contents></Contents>
      <Name></Name>
      <Password></Password>
    </div>
  );
}

function Title() {
  const { setTitle, setClick } = useStore();
  return (
    <div className="pb-4">
      <input
        className={`${styles.form} text-xl font-medium`}
        type="text"
        placeholder="제목"
        onChange={(e) => {
          setTitle(e.target.value);
          setClick(true);
        }}
      ></input>
    </div>
  );
}

function Contents() {
  const { contents, setContents, setClick } = useStore();

  return (
    <div
      className="pb-3"
      style={{ flex: 1, display: "flex", flexDirection: "column" }}
    >
      <div>
        <TextareaAutosize
          className={`${styles.form}  ${styles.contentForm} min-h-48 resize-none`}
          style={{ height: "100%" }}
          placeholder="내용"
          onChange={(e) => {
            setContents(e.target.value);
            setClick(true);
          }}
        ></TextareaAutosize>
      </div>

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
  const { setName, setRelationship, setClick } = useStore();

  return (
    <div className="pb-6">
      <div className="row">
        <h2 className="text-base" style={{ color: "#37271A" }}>
          보내는 사람
        </h2>

        <div className="flex-1 pl-2.5">
          <input
            className={`${styles.form} text-center`}
            type="text"
            placeholder="이름"
            onChange={(e) => {
              setName(e.target.value);
              setClick(true);
            }}
          ></input>
        </div>

        <div className="flex-1 pl-2.5">
          <input
            className={`${styles.form} text-center`}
            type="text"
            style={{ flex: "1" }}
            placeholder="관계"
            onChange={(e) => {
              setRelationship(e.target.value);
              setClick(true);
            }}
          ></input>
        </div>
      </div>
    </div>
  );
}

function Password() {
  const {password, setPassword, setClick } = useStore();

  return (
    <div className="pb-5">
      <div className="row">
        <div style={{ width: 92.16 }}></div>
        <h2
          className="text-base flex-1"
          style={{ textAlign: "right", paddingLeft: 10, color: "#37271A" }}
        >
          비밀번호
        </h2>
        <div className="flex-1 pl-2.5">
          <input
            className={`${styles.form} text-center`}
            type="password"
            autoComplete="new-password"
            placeholder="비밀번호"
            onChange={(e) => {
              setPassword(e.target.value);
              setClick(true);
            }}
          ></input>
          <p className={`${styles.help} ${validP(password).color}`}>
            {validP(password).text}
          </p>
        </div>
      </div>
     
     
    </div>
  );
}
