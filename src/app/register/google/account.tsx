"use client";
import React, { useRef, useState } from "react";
import styles from "./register.module.css";
import { existUsername } from "src/server/apiAction/existUsername";
import { useStoreBase } from "./model";
import {
  InputField,
  BasicFormArea,
  BasicHeader,
  BasicBody,
  BasicFooter,
} from "src/components";
import { validateMessage, validateUsername } from "src/utils/validate";
import { action } from "src/lib/actionResponse";
import { SendButton } from "./SendButton";

export default function Account() {
  const {
    username,
    setUsername,
    message,
    setMessage,
    next,
    prev,
  } = useStoreBase();

  const [isDuplicated, setIsDuplicated] = useState(false);
  const [loading, setLoading] = useState(false);

  const clickUsernameBtn = useRef(false);
  const isWaitResponse = useRef(false);

  function editUsername(text) {
    isWaitResponse.current = false;
    setUsername(text);
    clickUsernameBtn.current = false;
    setIsDuplicated(false);
  }

  async function checkUsername(event) {
    event.preventDefault();

    // 이미 검사 중 이면 검사를 하지 않음
    if (isWaitResponse.current) return;

    // 유효한 아이디가 아니면 중복 검사를 하지 않는다.
    try {
      validateUsername(username);
    } catch (e) {
      return;
    }

    // 버튼 로딩바 표시
    setLoading(true);

    // 서버에서 중복인지 검사한다.
    isWaitResponse.current = true;
    try {
      const response = await action(existUsername(username));
      // 서버에서 값이 오기전에 문자열을 수정했는지 확인
      if (isWaitResponse.current) {
        setIsDuplicated(response);
        clickUsernameBtn.current = true;
      }
      isWaitResponse.current = false;
    } catch (error) {
      alert(`오류: ${error.message}`);
    }


    // 버튼 로딩바 끄기
    setLoading(false);
  }

  const usernameValidation = usernameValid(username, isDuplicated, clickUsernameBtn.current);
  const messageValidation = messageValid(message);

  const canSubmit = () =>
    usernameValidation.status == 'valid' && messageValidation.status == 'valid'

  return (
    <BasicFormArea>
      <BasicHeader>
        아이디와 사람들에게 전하고 싶은
        <br />
        한줄 글을 적어주세요
      </BasicHeader>
      <BasicBody paddingBottom={false}>
        <div className="flex flex-col h-full">
          <div className="pb-12 w-full">
            <InputField
              label="아이디"
              placeholder="아이디를 입력해주세요"
              value={username}
              onChange={editUsername}
              helpMessage={usernameValidation.text}
              color={usernameValidation.status}
            >
              <button
                type="button"
                className={
                  loading
                    ? `${styles.dupButton} ${styles.loading}`
                    : styles.dupButton
                }
                onClick={checkUsername}
              >
                <div
                  style={{
                    display: "flex",
                    textAlign: "center",
                    justifyContent: "center",
                  }}
                >
                  {loading ? <p className={styles.animation} /> : "중복확인"}
                </div>
              </button>
            </InputField>
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
            2024년 8월 1일부로 공군에서 주말 휴대폰 사용, 네이버 BAND 활성화 이유로
            인터넷편지를 출력해주지 않습니다.
            <br />
            대신 주말에 휴대폰을 사용해 받은 편지들을 확인할 수 있습니다.
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
  );
}

function usernameValid(username: string, duplicate: boolean, touchBtn: boolean) {
  if (!touchBtn && username == "") return { status: 'default', text: "아이디를 입력해주세요" };
  if (!touchBtn) return { status: 'default', text: "" };
  if (username == "") return { status: 'warn', text: "아이디를 입력해주세요" };

  try {
    validateUsername(username);
  } catch (error) {
    return { status: 'warn', text: error.message };
  }

  if (touchBtn && duplicate) {
    return { status: 'warn', text: '이미 사용중인 아이디 입니다' };
  }

  return { status: 'valid', text: "사용할 수 있는 아이디입니다" };
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

