"use client";
import { useState } from "react";
import styles from "./page.module.css";
import crypto from "crypto";
import { useRouter } from "next/navigation";
import { editPassword } from "src/app/api/profile/profile";
import { signOut } from "next-auth/react";

export function Client({ username }) {
  const [originPassword, setorpassword] = useState("");

  const [password, setpassword] = useState("");
  const [repassword, setrepassword] = useState("");
  const router = useRouter();

  async function click() {
    if (!canSubmit()) return;

    let encryptedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    const response = await editPassword(username, encryptedPassword);
    if (response.status == 200) {
      alert("비밀번호가 변경되었습니다! 다시 로그인 해주세요.");
      signOut({ callbackUrl: "/" });

    } else {
      alert(`error: ${response.status} ${response.error}`);
    }
  }

  function canSubmit() {
    return (
      validP(originPassword) &&
      validP(password).valid &&
      validR(repassword, password).valid
    );
  }

  return (
    <>
      <div className="screen">
        <div style={{ flex: 64 }}></div>
        <div className="pt-12 pb-8 w-full">
          <h2 className={styles.title}>비밀번호 재설정</h2>
        </div>

        <div style={{ flex: 12 }}></div>

        <div className="pb-4 w-full">
          <p className={styles.formTitle}>기존 비밀번호</p>
          <div style={{ height: 2 }}></div>
          <input
            className={styles.form}
            type="password"
            placeholder="비밀번호를 입력해주세요"
            onChange={(e) => {
              setorpassword(e.target.value);
            }}
          ></input>
          <div style={{ height: 19 }}></div>
        </div>

        <div className="pb-4 w-full">
          <p className={styles.formTitle}>새로운 비밀번호</p>
          <div style={{ height: 2 }}></div>
          <input
            className={styles.form}
            type="password"
            placeholder="비밀번호를 입력해주세요"
            onChange={(e) => {
              setpassword(e.target.value);
            }}
          ></input>
          <div style={{ height: 19 }}></div>
        </div>

        <div className="pb-4 w-full">
          <p className={styles.formTitle}>비밀번호 재확인</p>
          <div style={{ height: 2 }}></div>
          <input
            className={styles.form}
            type="password"
            placeholder="비밀번호를 입력해주세요"
            onChange={(e) => {
              setrepassword(e.target.value);
            }}
          ></input>
          <div style={{ height: 19 }}></div>
        </div>

        <div style={{ flex: 90 }}></div>
        <div className="pb-8 pt-6 w-full">
          <button
            className={canSubmit() ? "submit" : "submit disable"}
            onClick={click}
          >
            비밀번호 변경
          </button>
        </div>
      </div>
    </>
  );
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
