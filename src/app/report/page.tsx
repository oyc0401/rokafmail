"use client";
import { useState } from "react";
import { BasicBody, BasicFooter, BasicFormArea, BasicHeader, InputAutoSize, InputField } from "src/components";
import { sendEmail } from "src/server/apiAction/report";


export default function Report({ searchParams }) {
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const lastUrl = searchParams.url;

  async function click(e) {
    e.preventDefault();
    await sendEmail(message, email,lastUrl);
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
        <div className="pt-2">
          <InputField
            label="이메일"
            type="text"
            value={email}
            placeholder="답변을 위한 이메일 주소 입력"
            onChange={setEmail}
          ></InputField>
        </div>

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
