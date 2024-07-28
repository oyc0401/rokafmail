"use client";
import React, { useState } from "react";
import styles from "./register.module.css";
import { useStoreBase } from "./model";
import { useRouter } from "next/navigation";
import { register } from "src/server/apiAction/register";
import {
  InputField,
  BasicFormArea,
  BasicHeader,
  BasicBody,
  BasicFooter,
} from "src/components";
import { validateMessage } from "src/utils/validate";
import { SendButton } from "./SendButton";

export default function Message() {
  const {
    message,
    setMessage,
    prev,
  } = useStoreBase();

  const messageValidation = messageValid(message);

  return (
    <>
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
              이제 훈련병이 휴대폰을 사용해 받은 편지들을 확인할 수 있습니다.
              <br />
              2024년 8월 1일부로 공군에서 주말 휴대폰 사용, 네이버 BAND 활성화로 인해
              인터넷편지를 출력해주지 않습니다
            </p>
          </div>
        </BasicBody>
        <BasicFooter>
          <button className={`submit mini`} onClick={prev} type="button">
            이전
          </button>
          <SendButton />
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