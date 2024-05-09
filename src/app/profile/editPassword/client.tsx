"use client";
import { useState } from "react";
import styles from "./page.module.css";
import crypto from "crypto";
import { useRouter } from "next/navigation";
import { editPassword } from "src/app/api/profile/profile";
import { signOut } from "next-auth/react";
import { BasicBody, BasicFooter, BasicFormArea, BasicHeader, InputField } from "src/components";

export function Client({ username }) {
  const [originPassword, setorpassword] = useState("");

  const [password, setpassword] = useState("");
  const [repassword, setrepassword] = useState("");
  const router = useRouter();

  async function click(e) {
    e.preventDefault();
    if (!canSubmit()) return;

    let encryptedOriginPassword = crypto
      .createHash("sha256")
      .update(originPassword)
      .digest("hex");

    let encryptedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    const response = await editPassword(username, encryptedOriginPassword, encryptedPassword);
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
      <BasicFormArea>
        <BasicHeader>
          비밀번호 변경
        </BasicHeader>
        <BasicBody>
          <InputField
            label="비밀번호"
            type="password"
            autoComplete="new-password"
            value={originPassword}
            placeholder="비밀번호를 입력해주세요"
            onChange={setorpassword}
            helpMessage={validP(originPassword).text}
            color={validP(originPassword).color}
          />
          <InputField
            label="새로운 비밀번호"
            type="password"
            autoComplete="new-password"
            value={password}
            placeholder="새 비밀번호를 입력해주세요"
            onChange={setpassword}
            helpMessage={validP(password).text}
            color={validP(password).color}
          />
          <InputField
            label="비밀번호 재확인"
            type="password"
            autoComplete="new-password"
            value={repassword}
            placeholder="비밀번호를 다시 입력해주세요"
            onChange={setrepassword}
            helpMessage={validR(repassword, password).text}
            color={validR(repassword, password).color}
          />
        </BasicBody>
        <BasicFooter>
          <button
            className={canSubmit() ? "submit" : "submit disable"}
            onClick={click}
          >
            변경하기
          </button>
        </BasicFooter>
      </BasicFormArea>
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
