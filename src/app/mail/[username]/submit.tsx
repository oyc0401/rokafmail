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

  const canSubmit = () =>
    validN(name).valid &&
    validR(relationship).valid &&
    validT(title).valid &&
    validC(contents).valid &&
    validP(password).valid;

  async function postMail() {
    setProgress(true);
    await mailApi({
      username: username,
      name: name,
      relationship: relationship,
      title: title,
      contents: contents,
      password: password,
    })
      .then((response) => {
        if (response.status === 200) {
          alert("편지 전송 성공!");

          router.push(`/mail/${username}/complete?sc=200`);
        } else {
          alert(`편지 전송 실패 ${response.status}, ${response.message}`);
        }
      })
      .catch((error) => {
        alert(`오류발생, 편지 전송 실패 ${error}`);
        setProgress(false);
      });
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
      <div
        style={{
          paddingTop: 12,
          paddingBottom: 36,
          width:'100%',
        }}
      >
        <div className="row">
          <a className={`submit mini`} href={`/mails/${username}`}>
            편지함
          </a>
          <button
            className={canSubmit() ? "submit" : "submit disable"}
            onClick={click}
          >
            전송하기
          </button>
        </div>
      </div>

      <Loading></Loading>
    </>
  );
}
