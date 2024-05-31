"use client";
import React, { useRef, useState } from "react";
import styles from "./register.module.css";
import { duplicateUsername } from "src/app/api/register/duplicateUsername/serverAction";
import { useStore, useStoreBase } from "./model";
import {
  InputField,
  BasicFormArea,
  BasicHeader,
  BasicBody,
  BasicFooter,
} from "src/components";
import { validatePassword, validateUsername } from "src/utils/validate";

export default function Account() {
  const {
    username,
    password,
    repassword,
    setUsername,
    setPassword,
    setRepassword,
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
    const val = await duplicateUsername(username);
    // 서버에서 값이 오기전에 문자열을 수정했는지 확인
    if (isWaitResponse.current) {
      setIsDuplicated(val);
      clickUsernameBtn.current = true;
    }
    isWaitResponse.current = false;

    // 버튼 로딩바 끄기
    setLoading(false);
  }

  const usernameValidation = usernameValid(username, isDuplicated, clickUsernameBtn.current);
  const passwordValidation = passwordValid(password);
  const repasswordValidation = repasswordValid(repassword, password);

  const canSubmit = () =>
    usernameValidation.status == 'valid'
    && passwordValidation.status == 'valid'
    && repasswordValidation.status == 'valid'


  const click = (event) => {
    event.preventDefault();
    if (!canSubmit()) return;
    if (canSubmit()) next();
  };

  return (
    <BasicFormArea>
      <BasicHeader>
        수료 후 편지함 확인을 위해
        <br />
        비밀번호를 설정해주세요
      </BasicHeader>
      <BasicBody>
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
          label="비밀번호"
          type="password"
          value={password}
          autoComplete="new-password"
          placeholder="비밀번호를 입력해주세요"
          onChange={setPassword}
          helpMessage={passwordValidation.text}
          color={passwordValidation.status}
        />
        <InputField
          label="비밀번호 재확인"
          type="password"
          value={repassword}
          autoComplete="new-password"
          placeholder="비밀번호를 다시 입력해주세요"
          onChange={setRepassword}
          helpMessage={repasswordValidation.text}
          color={repasswordValidation.status}
        />
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
          다음
        </button>
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

function passwordValid(password: string) {
  // 빈칸일 때
  if (password == "") return { status: 'default', text: "" };

  try {
    validatePassword(password);
  } catch (error) {
    return { status: 'warn', text: error.message };
  }

  // 통과
  return { status: 'valid', text: "사용할 수 있는 비밀번호입니다" };
}

function repasswordValid(repassword: string, password: string) {
  // 빈칸일 때
  if (repassword == "") return { status: 'default', text: "" };

  // 비밀번호가 같지 않음
  if (repassword != password) return { status: 'warn', text: "비밀번호가 같지 않습니다" };

  // 통과
  return { status: 'valid', text: "" };
}
