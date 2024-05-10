"use client";
import { useState } from "react";
import { BasicBody, BasicFooter, BasicFormArea, BasicHeader, InputAutoSize, InputField } from "src/components";
import { sendEmail } from "./server";


export default function Report() {
  const [message, setMessage] = useState('');

  async function click(e) {
    e.preventDefault();
    await sendEmail(message);
    alert('소중한 의견 감사합니다!');
    setMessage('');
  }

  return (<>
    <BasicFormArea>
      <BasicHeader>
        문의사항
        <p className="text-base pt-3 font-normal">버그 또는 개선사항을 적어주세요!</p>
      </BasicHeader>
      <BasicBody>

        <InputAutoSize
          label="내용"
          type="text"
          value={message}
          placeholder="내용을 입력해주세요"
          onChange={setMessage}
        />
      </BasicBody>
      <BasicFooter>
        <button
          className="submit"
          onClick={click}
        >
          전송하기
        </button>
      </BasicFooter>
    </BasicFormArea>
  </>
  );
}
