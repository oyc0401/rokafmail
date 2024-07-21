"use client";
import React, { useRef, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import {
  InputField,
  BasicFormArea,
  BasicHeader,
  BasicBody,
  BasicFooter,
} from "src/components";
import { useRouter } from "next/navigation";
import { TextArea } from "src/components/rokaf/TextArea";
import { GoogleButton } from "src/components/SocialSignIn/GoogleButton";
import localFont from 'next/font/local'

const INKLIPQUID = localFont({
  src: [
    { path: '../../../../public/fonts/INKLIPQUID_subset.ttf' },
  ]
})


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

  const click = async (e) => {
    e.preventDefault()
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
    <div className="max-w-3xl mx-auto h-full">
      <form className="w-full h-full">
        <div className="px-4 flex flex-col h-full max-w-xl mx-auto">
          <div className="flex-[2_2_0%] flex flex-col justify-end">
            <p className={`pt-24 pb-12 ${INKLIPQUID.className}  text-primary text-5xl`}>하늘인편</p>
            {/* <h1 className=" font-medium text-primary">하늘인편</h1> */}
          </div>
          <div className="pb-[36px]">
            <div className="px-2 pb-[36px]">
              <TextArea
                className='pb-[18px]'
                placeholder="아이디"
                onChange={setUsername}
              />
              <TextArea
                className="pb-1"
                placeholder="비밀번호"
                type="password"
                onChange={(t) => {
                  setErrorMessage("");
                  setpassword(t);
                }}
              />
              <p className="warn text-xs text-left">{errorMessage}</p>

            </div>
            <button className={"mb-[18px] bg-primary text-white text-xl rounded-lg py-3 w-full"} type="submit" onClick={click}>
              로그인
            </button>
            <a className="text-sm text-[#ABABAB]">계정이 없으신가요? 회원가입</a>
          </div>
          <div className="flex-[3_3_0%]">
            <div className="mb-6 bg-[#E5E5E5] h-[1px] w-full"></div>
            <GoogleButton callbackUrl={callbackUrl ?? '/'}>구글 계정으로 계속하기</GoogleButton>
          </div>
        </div>
      </form>
    </div>

  );
}
