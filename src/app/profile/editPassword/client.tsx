"use client";
import { useState } from "react";
import crypto from "crypto";
import { editPassword } from "src/app/apiAction/profile/action";
import { signOut } from "next-auth/react";
import { BasicBody, BasicFooter, BasicFormArea, BasicHeader, InputField } from "src/components";
import { validatePassword } from "src/utils/validate";

export function Client({ username }) {
  const [originPassword, setorpassword] = useState("");

  const [password, setpassword] = useState("");
  const [repassword, setrepassword] = useState("");
 
  async function click(e) {
    e.preventDefault();
    if (!canSubmit()) return;

    const encryptedOriginPassword = crypto
      .createHash("sha256")
      .update(originPassword)
      .digest("hex");

    const encryptedPassword = crypto
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

  const originPasswordValidation = passwordValid(originPassword);
  const passwordValidation = passwordValid(password);
  const repasswordValidation = repasswordValid(repassword, password);

  const canSubmit = () =>
    originPasswordValidation.status == 'valid'
    && passwordValidation.status == 'valid'
    && repasswordValidation.status == 'valid'

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
            helpMessage={originPasswordValidation.text}
            color={originPasswordValidation.status}
          />
          <InputField
            label="새로운 비밀번호"
            type="password"
            autoComplete="new-password"
            value={password}
            placeholder="새 비밀번호를 입력해주세요"
            onChange={setpassword}
            helpMessage={passwordValidation.text}
            color={passwordValidation.status}
          />
          <InputField
            label="비밀번호 재확인"
            type="password"
            autoComplete="new-password"
            value={repassword}
            placeholder="비밀번호를 다시 입력해주세요"
            onChange={setrepassword}
            helpMessage={repasswordValidation.text}
            color={repasswordValidation.status}
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
