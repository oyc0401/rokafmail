"use client";
import React, { useEffect, useState } from "react";
import styles from "./register.module.css";
import { useStore, useStoreBase } from "./model";
import { useRouter } from "next/navigation";
import { usePathname, useSearchParams } from "next/navigation";
import { registerApi } from "src/app/api/register/register";
import {
  InputField,
  BasicFormArea,
  BasicHeader,
  BasicBody,
  BasicFooter,
} from "src/components";

import axios from "axios";
import crypto from "crypto";
export default function Message() {
  const {
    generation,
    name,
    birth,
    username,
    password,
    message,
    setMessage,
    prev,
  } = useStoreBase();

  const [progress, setProgress] = useState(false);

  const router = useRouter();

  const canSubmit = () => validM(message).valid;

  async function send() {
    let encryptedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    await registerApi({
      username: username,
      password: encryptedPassword,
      name: name,
      birth: birth,
      generation: Number(generation),
      message: message,
    })
      .then((response) => {
        if (response.status === 200) {
          window.onbeforeunload = null;
          router.push(`/register/link/${username}`);
        } else {
          alert(`회원가입 실패 ${response.status}, ${response.message}`);
        }
      })
      .catch((error) => {
        alert(`오류발생, 회원가입 실패 ${error}`);
      });
  }

  async function click(event) {
    event.preventDefault();
    if (!canSubmit()) return;

    if (canSubmit()) {
      setProgress(true);
      await send();
      setProgress(false);
    }
  }

  const messageValidation = validM(message);
  return (
    <>
      <div
        className={styles.registerLoad}
        style={{
          display: progress ? "flex" : "none",
        }}
      >
        <div className={`${styles.animation} ${styles.bigAnimation}`}></div>
      </div>
      <BasicFormArea>
        <BasicHeader>
          편지지에 보여질
          <br />
          한줄 글을 적어주세요
        </BasicHeader>
        <BasicBody paddingBottom={false}>
          <div className="flex flex-col h-full">
            <div className="pb-12 w-full">
              <InputField
                label="한줄 글"
                placeholder="한줄 글을 작성해주세요"
                value={message}
                onChange={setMessage}
                helpMessage={messageValidation.text}
                color={messageValidation.color}
              />
            </div>
            <div style={{ flex: 1 }}></div>
            <p className={styles.intro}>
              편지를 보내면 훈련병에게 실물로 된 편지가 도착합니다.
              <br />
              공군 기본군사훈련단은 훈련 3주차부터 인터넷편지 작성을 할 수
              있습니다. 따라서 이곳에서 보낸 편지들은 3주차 이후에 순차적으로
              발송됩니다.
            </p>
          </div>
        </BasicBody>
        <BasicFooter>
          <button className={`submit mini`} onClick={prev} type="button">
            이전
          </button>
          <button
            className={canSubmit() ? "submit" : "submit disable"}
            onClick={click}
            type="submit"
          >
            만들기
          </button>
        </BasicFooter>
      </BasicFormArea>
    </>
  );
}

function validM(message) {
  // 빈칸일 때
  if (message == "") return { text: "", valid: false };

  // 너무 많을 때
  if (50 < message.length)
    return { text: "글이 너무 길어요", color: "warn", valid: false };

  // 통과
  return { text: "", color: "great", valid: true };
}
