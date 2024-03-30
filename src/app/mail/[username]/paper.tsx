"use client";
import { useEffect, useRef } from "react";
import styles from "./paper.module.css";
import { useStore } from "./model";
import { validC, validP } from "./valid";
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
    <div role='paper' className=' px-4 py-2 mx-4 mb-4 bg-[#FFFDF8] shadow-md flex-1 flex-col flex'  >
      <div className="w-full p-3">
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
        className={`${styles.form} text-lg font-medium`}
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
  const inputRef = useRef<any>(null);
  const handleClick = () => {
    // input 요소에 포커스를 주기
    inputRef.current.focus();
  };

  return (
    
    <div className="flex-1 pb-3 flex flex-col" >
      <TextareaAutosize
        className={`${styles.form} text-base ${styles.contentForm} min-h-36 resize-none`}
        placeholder="내용"
        ref={inputRef}
        onChange={(e) => {
          setContents(e.target.value);
          setClick(true);
        }}
      ></TextareaAutosize>
      <div className="flex-1 cursor-text" onClick={handleClick}></div>

      <div className={styles.formLine}></div>

      <div className="row pt-0.5">
        <p className={`text-xs font-fontmedium text-left ${validC(contents).color}`}>
          {validC(contents).text}
        </p>
        <div style={{ flex: 1 }}></div>
        <p className={`text-xs font-fontmedium text-left`}>{`${contents.length}/1200`}</p>
      </div>
    </div>
  );
}

function Name() {
  const { setName, setRelationship, setClick } = useStore();

  return (
    <div className="pb-5">
      <div className="row">
        <h2 className="text-base" style={{ color: "#37271A" }}>
          보내는 사람
        </h2>

        <div className="flex-1 pl-2.5">
          <input
            className={`${styles.form} text-base text-center`}
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
            className={`${styles.form} text-base text-center`}
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
  const { password, setPassword, setClick } = useStore();

  return (
    <div className="pb-1">
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
            className={`${styles.form} text-base text-center`}
            type="password"
            autoComplete="new-password"
            placeholder="비밀번호"
            onChange={(e) => {
              setPassword(e.target.value);
              setClick(true);
            }}
          ></input>
          <p className={`text-xs font-fontmedium text-left h-4 ${validP(password).color}`}>
            {validP(password).text}
          </p>
        </div>
      </div>


    </div>
  );
}
