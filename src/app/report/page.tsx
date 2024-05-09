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
    history.back();
    // if (response) {

    // } else {
    //   alert('알 수 없는 오류가 발생했습니다. 버그가 또 발생했네요...ㅜㅜ oyc0401@gmail.com으로 해당 문제를 알려주시면 감사하겠습니다.')
    // }

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
