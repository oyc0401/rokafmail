"use client";
import React, { useRef, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import styles from "./page.module.css";
import { Suspense } from "react";
import {
  InputField,
  BasicArea,
  BasicHeader,
  BasicBody,
  BasicFooter,
} from "src/components";
import { useRouter } from "next/navigation";

export default function Login() {
  return (
    <Suspense fallback={<></>}>
      <Page />
    </Suspense>
  );
}

const errorToMsg = (error) => {
  if (error == "CredentialsSignin") return "아이디 또는 비밀번호가 다릅니다.";
  return error;
};

function Page() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const error = searchParams.get("error");

  const [username, setUsername] = useState("");
  const [password, setpassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(errorToMsg(error));

  const click = async () => {
    // console.log(username);
    // console.log(password);

    const result = await signIn("credentials", {
      username: username,
      password: password,
      callbackUrl: callbackUrl ?? "/",
      redirect: false,
    });

    if (result) {
      if (result.ok) {
        router.replace(callbackUrl ?? "/");
      } else {
        setErrorMessage(errorToMsg(result.error ?? ""));
      }
    }
  };

  return (
    <BasicArea>
      
      <BasicHeader>
        아이디와 비밀번호를
        <br />
        입력해주세요
      </BasicHeader>
      <BasicBody>
        <InputField
          label="아이디"
          placeholder="아이디를 입력해주세요"
          onChange={setUsername}
          helpMessage={" "}
        />
        <InputField
          label="비밀번호"
          placeholder="비밀번호를 입력해주세요"
          type="password"
          onChange={setpassword}
          helpMessage={errorMessage}
          color={"warn"}
      
        />
      </BasicBody>
      <BasicFooter>
        <button className={"submit"} type="submit" onClick={click}>
          로그인
        </button>
      </BasicFooter>
    </BasicArea>
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
