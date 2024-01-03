"use client";
import styles from "./page.module.css";
import axios from "axios";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Nav } from "src/components/Nav";
import { useStore } from "./model";
import { validN, validR, validC, validT, validP } from "./valid";

export function Submit(params) {
  const { name, relationship, title, contents, password } = useStore();

  async function click() {
    await params.click();
  }
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
