"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import styles from "./page.module.css";
import { useStore } from "./model";
import { mailApi } from "src/app/api/mail/mail";
import { validateContent, validateMailPassword, validateRelationship, validateTitle, validateWriter } from "src/utils/validate";

export function Submit({ username }) {
  const { name, relationship, title, contents, password, isPublic } = useStore();

  const router = useRouter();

  const [progress, setProgress] = useState(false);

  const canSubmit = () => {
    try {
      validateContent(contents);
      validateTitle(title);
      validateMailPassword(password);
      validateRelationship(relationship);
      validateWriter(name);
    } catch (e) {
      return false;
    }
    return true;
  }

  async function postMail() {
    setProgress(true);
    await mailApi({
      username: username,
      name: name,
      relationship: relationship,
      title: title,
      contents: contents,
      password: password,
      isPublic: isPublic,
    })
      .then((response) => {
        if (response.status === 200) {
          alert("편지 전송 성공!");

          router.push(`/mail/${username}/complete?sc=200`);
        } else {
          alert(`편지 전송 실패 ${response.status}, ${response.message}`);
        }
        setProgress(false);
      })
      .catch((error) => {
        alert(`오류발생, 편지 전송 실패 ${error}`);
        setProgress(false);
      });
  }

  async function click() {
    const canpost = canSubmit();
    if (canpost) {
      postMail()
    } else {
      try {
        validateTitle(title);
        validateContent(contents);
        validateWriter(name);
        validateRelationship(relationship);
        validateMailPassword(password);
      } catch (e) {
        alert(e.message);
      }

    }
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
          <a className={`submit mini hidden glxfd:block`} href={`/mails/${username}`}>
            편지함
          </a>
          <button
            className={canSubmit() ? "submit" : "submit disable"}
            onClick={click}
          >
            전송하기
          </button>
        </div>
      </footer>
      <Loading></Loading>
    </>
  );
}
