"use client";
import React, { useRef,useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import styles from './page.module.css'

export default function Login() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");



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
    
  };

  return (
    <>
      <div className="screen">
        <div style={{ flex: 64 }}></div>
        <div className="pt-12 pb-8 w-full">
          <h2 className={styles.title}>
            로그인
          </h2>
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

        <div style={{ height: 95 + 16 }}></div>

        <div style={{ flex: 90 }}></div>
        <div className="pb-8 pt-6 w-full">
          <button
            className={canSubmit() ? "submit" : "submit disable"}
            onClick={click}
          >
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