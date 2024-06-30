"use client";
import React, { useState } from "react";
import styles from "./register.module.css";
import { useStoreBase } from "./model";
import { useRouter } from "next/navigation";
import { register } from "src/app/apiAction/register";
import {
  InputField,
  BasicFormArea,
  BasicHeader,
  BasicBody,
  BasicFooter,
} from "src/components";

import crypto from "crypto";
import { validateMessage } from "src/utils/validate";
import { action } from "../apiSSR/actionResponse";
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


  async function send() {
    const encryptedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    const registerForm = {
      username: username,
      password: encryptedPassword,
      name: name,
      birth: birth,
      generation: Number(generation),
      message: message,
    }

    try {
      await action(register(registerForm));
      window.onbeforeunload = null;
      router.push(`/register/link/${username}`);
    } catch (error) {
      if (error.status == 400) {
        alert(`회원가입 실패 ${error.message}`);
      } else {
        alert(error.message);
      }

    }

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

  const messageValidation = messageValid(message);

  const canSubmit = () => messageValidation.status == 'valid';


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
          사람들에게 전하고 싶은
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
                color={messageValidation.status}
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

function messageValid(message: string) {
  // 빈칸일 때
  if (message == "") return { status: 'default', text: "" };

  try {
    validateMessage(message);
  } catch (error) {
    return { status: 'warn', text: error.message };
  }

  // 통과
  return { status: 'valid', text: "" };
}