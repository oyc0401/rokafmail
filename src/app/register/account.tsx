"use client";
import React, { useRef, useState } from "react";
import styles from "./register.module.css";
import { duplicateUsername } from "src/server";
import { useStore, useStoreBase } from "./model";
import {
  InputField,
  BasicArea,
  BasicHeader,
  BasicBody,
  BasicFooter,
} from "src/components";

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

  const clickUsernameDup = useRef(false);
  const [validUser, setValidUser] = useState(false);

  let [loading, setLoading] = useState(false);
  const load = useRef(false);

  function editUsername(text) {
    load.current = false;
    setUsername(text);
    clickUsernameDup.current = false;
    setValidUser(false);
  }

  async function checkUsername() {
    if (!validU(username).valid) return;
    if (load.current) return;
    setLoading(true);
    load.current = true;
    const val = await duplicateUsername(username);
    // console.log(val)

    if (load.current) {
      setValidUser(!val);
      clickUsernameDup.current = true;
    }
    setLoading(false);
    load.current = false;
  }

  function validUUU() {
    if (!clickUsernameDup.current) return { text: "", valid: false };

    return validUser
      ? { text: "사용할 수 있는 아이디입니다,", color: "great", valid: true }
      : { text: "이미 사용중인 아이디 입니다", color: "warn", valid: false };
  }

  const canSubmit = () =>
    validUser && validP(password).valid && validR(repassword, password).valid;

  const click = () => {
    if (canSubmit()) next();
  };

  const UsernameValidation = validUUU();
  const passwordValidation = validP(password);
  const repasswordValidation = validR(repassword, password);

  return (
      <BasicArea>
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
            helpMessage={UsernameValidation.text}
            color={UsernameValidation.color}
          >
            <button
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
            color={passwordValidation.color}
          />
          <InputField
            label="비밀번호 재확인"
            type="password"
            value={repassword}
            autoComplete="new-password"
            placeholder="비밀번호를 다시 입력해주세요"
            onChange={setRepassword}
            helpMessage={repasswordValidation.text}
            color={repasswordValidation.color}
          />
        </BasicBody>
        <BasicFooter>
            <button className={`submit mini`} onClick={prev}>
              이전
            </button>
            <button
              className={canSubmit() ? "submit" : "submit disable"}
              onClick={click}
            >
              다음
            </button>
        </BasicFooter>
      </BasicArea>
  );
}

function validU(username) {
  if (username == "") {
    return { text: "아이디를 입력해주세요", color: "warn", valid: false };
  }

  return {
    text: "사용할 수 있는 아이디입니다,",
    color: "great",
    valid: true,
  };
}

function validP(password) {
  // 빈칸일 때
  if (password == "") return { text: "", valid: false };

  // 짧을 때
  if (password.length < 4)
    return {
      text: "비밀번호는 4자리 이상이여야 합니다",
      color: "warn",
      valid: false,
    };

  // 통과
  return { text: "", color: "great", valid: true };
}

function validR(repassword, password) {
  // 빈칸일 때
  if (repassword == "") return { text: "", valid: false };

  // 비밀번호가 같지 않음
  if (repassword != password)
    return { text: "비밀번호가 같지 않습니다", color: "warn", valid: false };

  // 통과
  return { text: "", color: "great", valid: true };
}
