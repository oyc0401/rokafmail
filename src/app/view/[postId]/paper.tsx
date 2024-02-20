"use client";
import { useEffect } from "react";
import styles from "./paper.module.css";
import rokafLogo from "public/assets/rokaf.png";
import Image from "next/image";
export function Paper({post}) {
const {title, contents, name, relationship, password} = post;

  function Title() {
    return (
      <div className="pb-4">
        <input
          className={`${styles.form} ${styles.formTitle}`}
          type="text"
          placeholder="제목"
          value={title}
          readOnly
        ></input>
      </div>
    );
  }

  function Contents() {
    return (
      <div
        className="pb-3"
        style={{ flex: 1, display: "flex", flexDirection: "column" }}
      >
        <div style={{ flex: 1 }}>
          <textarea
            className={`${styles.form} ${styles.contentForm}`}
            style={{ height: "100%" }}
            placeholder="내용"
            value={contents}
            readOnly
          ></textarea>
        </div>

        <div className="row pt-0.5">
          <p className={`${styles.help}`}>{` `}</p>
        </div>
      </div>
    );
  }

  function Name() {
    return (
      <div className="pb-6">
        <div className="row">
          <h2 className="text-lg" style={{ color: "#37271A" }}>
            보내는 사람
          </h2>

          <div className="flex-1 pl-2.5">
            <input
              className={`${styles.form} ${styles.centerForm}`}
              type="text"
              placeholder="이름"
              value={name}
              readOnly
            ></input>
          </div>

          <div className="flex-1 pl-2.5">
            <input
              className={`${styles.form} ${styles.centerForm}`}
              type="text"
              style={{ flex: "1" }}
              placeholder="관계"
              value={relationship}
              readOnly
            ></input>
          </div>
        </div>
      </div>
    );
  }

  function Password() {
    return (
      <div className="pb-5">
        <div className="row">
          <div style={{ width: 92.16 }}></div>
          <h2
            className="text-lg flex-1"
            style={{ textAlign: "right", paddingLeft: 10, color: "#37271A" }}
          >
            비밀번호
          </h2>
          <div className="flex-1 pl-2.5">
            <input
              className={`${styles.form} ${styles.centerForm}`}
              type="password"
              autoComplete="new-password"
              placeholder="비밀번호"
              value={"****"}
              readOnly
            ></input>
            <p className={`${styles.help}`}></p>
          </div>
        </div>
      </div>
    );
  }

  
  return (
    <div
      className={styles.paper}
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
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
