"use client";
import axios from "axios";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Nav } from "src/components";

import styles from "./page.module.css";
import { useStore } from "./model";
import { validN, validR, validC, validT, validP } from "./valid";
import { mailApi } from "src/app/api/mail/mail";

export function Submit({ username }) {
  const { name, relationship, title, contents, password } = useStore();

  const router = useRouter();

  const [progress, setProgress] = useState(false);

  const canSubmit = () => {
    return validN(name).valid &&
      validR(relationship).valid &&
      validT(title).valid &&
      validC(contents).valid &&
      validP(password).valid;
  }

  async function postMail() {
    setProgress(true);

  }

  async function click() {
    console.log({ name, relationship, title, contents, password });
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
      {/* <div className="flex-1"></div> */}
      <footer className="container max-w-3xl mx-auto px-4">
        <div className="row pt-2 sm:pt-3 pb-8">
          <button className={`submit mini hidden glxfd:block`} style={{background:'red'}}>
            삭제
          </button>
          <button
            className={canSubmit() ? "submit" : "submit disable"}
            onClick={click}
          >
            수정
          </button>
        </div>
      </footer>
      <Loading></Loading>
    </>
  );
}
