"use client";
import { useState } from "react";
import { checkPassword } from "./cookie";
import {
  InputField,
  BasicFormArea,
  BasicHeader,
  BasicBody,
  BasicFooter,
} from "src/components";
import { useRouter,useSearchParams } from "next/navigation";

export function LoginPage({ postId }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [pw, setPw] = useState("");
  const [message, setMessage] = useState("");
  const callbackUrl = searchParams.get("callbackUrl");
  
  async function click(event) {
    event.preventDefault();
    const result = await checkPassword(postId, pw);

    if (result) {
      router.replace(callbackUrl??'null');
    } else {
      alert('비밀번호가 틀렸습니다.');
    }


  }



  return (
    <BasicFormArea>
      <BasicHeader>
        편지를 작성할 때 입력한
        <br />
        비밀번호를 입력해주세요
      </BasicHeader>
      <BasicBody>
        <InputField
          label="비밀번호"
          placeholder="비밀번호를 입력해주세요"
          type="password"
          onChange={(t) => {
            setPw(t);
            setMessage("");
          }}
          helpMessage={message}
          color={"warn"}
        />
      </BasicBody>
      <BasicFooter>
        <button className="submit" type="submit" onClick={click}>
          편지 열기
        </button>
      </BasicFooter>
    </BasicFormArea>
  );
}
