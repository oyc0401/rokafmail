"use client";
import axios from "axios";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Nav } from "src/components";
import { deletePost } from "src/app/api/mails/mail";

import styles from "./page.module.css";
import { useStore } from "./model";
import { validN, validR, validC, validT, validP } from "./valid";
import { mailApi } from "src/app/api/mail/mail";
import { editPost } from "./api";

export function Submit({ postId, username,posted, url }) {
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

  async function click() {
    const result = await editPost({postId, username, name, relationship, title, contents, password });

    if(result == '수정완료'){
      router.replace(`/mails/${username}/${postId}`);
    }else{
      alert(result);
    }
  }

 async  function onDelete(){
    var password = prompt("편지 삭제를 위해 비밀번호를 입력해주세요.", "");

    if (password) {
      const response = await deletePost(postId, password);

      if (response.status == 200) {
        if (posted) {
          // 이미 발송된 편지
          let isConfirm = confirm(
            "편지가 삭제되었습니다.\n공군 기훈단 사이트에서도 해당 편지를 찾아 삭제해주십시오.\n확인을 누를시 해당 페이지로 이동합니다.",
          );
          if (isConfirm) {
            window.open(url);
          }
        } else {
          // 미발송 편지
          alert("편지를 삭제했습니다.");
          router.replace(`/mails/${username}`);
        }
      } else {
        alert(response.error);
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
          <button className={`submit mini hidden glxfd:block`} style={{background:'red'}} onClick={onDelete}>
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
