"use client";
import React, { useState } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export function Find() {
  const [generation, setGeneration] = useState("");
  const [name, setName] = useState("");
  const [birth, setBirth] = useState("");
  const router = useRouter();

  function click(){
    router.push(`/search?generation=${generation}&name=${name}&birth=${birth}`);
  }

  function canSubmit() {
    return generation != "" && name != "" && birth != "";
  }

  return (
    <div className="screen">
      <div style={{ flex: 100 }}></div>
      <h2 className={styles.title}>
        편지함을 만들때 입력한
        <br />
        정보를 입력해주세요
      </h2>

      <div style={{ flex: 49 }}></div>

      <p className={styles.formTitle}>기수</p>
      <div style={{ height: 2 }}></div>
      <input
        className={styles.form}
        value={generation}
        type="text"
        placeholder="기수를 입력해주세요 예시) 850"
        onChange={(e) => {
          setGeneration(e.target.value);
        }}
      ></input>

      <div style={{ height: 16 }}></div>

      <p className={styles.formTitle}>이름</p>
      <div style={{ height: 2 }}></div>
      <input
        className={styles.form}
        value={name}
        type="text"
        placeholder="이름을 입력해주세요"
        onChange={(e) => {
          setName(e.target.value);
        }}
      ></input>

      <div style={{ height: 16 }}></div>

      <p className={styles.formTitle}>생년월일</p>
      <div style={{ height: 2 }}></div>
      <input
        className={styles.form}
        value={birth}
        type="text"
        placeholder="생년월일 8자리를 입력해주세요"
        onChange={(e) => {
          setBirth(e.target.value);
        }}
      ></input>

      <div style={{ flex: 138 }}></div>
      <button
        className={canSubmit() ? "submit" : "submit disable"}
        onClick={click}
      >
        다음
      </button>
      <div style={{ height: 36 }}></div>
    </div>
  );
}
