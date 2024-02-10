"use client";
import React, { useRef, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import styles from "./page.module.css";
import { Suspense } from "react";

export default function Login() {
  return (
    <Suspense fallback={<>Loading...</>}>
      <Page />
    </Suspense>
  );
}

function Page() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const error = searchParams.get("error");

  const errorMessage = useRef("");
  if (error == "CredentialsSignin") {
    errorMessage.current = "아이디 또는 비밀번호가 다릅니다.";
  }

  const [username, setUsername] = useState("");
  const [password, setpassword] = useState("");

  function canSubmit() {
    return validU(username).valid && validP(password).valid;
  }

  const click = async () => {
    // console.log(emailRef.current)
    // console.log(passwordRef.current)

    const result = await signIn("credentials", {
      username: username,
      password: password,
      callbackUrl: callbackUrl ?? "/",
    });
    // console.log(result)
  };

  return (
    <>
      <div className="screen">
        <div style={{ flex: 64 }}></div>
        <div className="pt-12 pb-8 w-full">
          <h2 className={styles.title}>로그인</h2>
        </div>

        <div style={{ flex: 12 }}></div>

        <div className="pb-4 w-full">
          <p className={styles.formTitle}>아이디</p>
          <div style={{ height: 2 }}></div>
          <input
            className={styles.form}
            placeholder="아이디를 입력해주세요"
            onChange={(e) => setUsername(e.target.value)}
          />
          <div style={{ height: 19 }}></div>
        </div>

        <div className="pb-4 w-full">
          <p className={styles.formTitle}>비밀번호</p>
          <div style={{ height: 2 }}></div>
          <input
            className={styles.form}
            type="password"
            placeholder="비밀번호를 입력해주세요"
            onChange={(e) => setpassword(e.target.value)}
          />
          <div style={{ height: 19 }}></div>
        </div>
        <p className={`warn ${styles.warning}`}>{errorMessage.current}</p>

        <div style={{ height: 95 + 16 }}></div>

        <div style={{ flex: 90 }}></div>
        <div className="pb-8 pt-6 w-full">
          <button className={"submit"} onClick={click}>
            로그인
          </button>
        </div>
      </div>
    </>
  );
}

function validP(password) {
  if (password === "") return { text: "", valid: false };
  return { text: "", color: "great", valid: true };
}

function validU(username) {
  if (username === "") return { text: "", valid: false };
  return { text: "", color: "great", valid: true };
}
