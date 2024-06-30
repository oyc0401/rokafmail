"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { editProfile } from "src/app/apiAction/profile";
import { BasicBody, BasicFooter, BasicFormArea, BasicHeader, InputField } from "src/components";

import { validateMessage, validateBirth, validateName } from "src/utils/validate";
import { action } from "src/app/apiSSR/actionResponse";

export function Client({ username, name, birth, message }) {
  const [nameForm, setName] = useState(name);
  const [birthForm, setBirth] = useState(birth);
  const [messageForm, setmessage] = useState(message);

  const router = useRouter();

  async function click(e) {
    e.preventDefault();
    try {
      await action(editProfile(
        nameForm,
        birthForm,
        messageForm,
      ));
      alert('수정되었습니다')
      router.push("/profile");
      router.refresh();
    } catch (error) {
      if (error.status == 401) {
        alert('로그인을 해주세요');
        router.replace('/profile');
      } else {
        alert(`error: ${error.message}`);
      }
    }

  };

  const nameValidation = nameValid(nameForm);
  const birthValidation = birthValid(birthForm);
  const messageValidation = messageValid(messageForm);

  const canSubmit = () =>
    nameValidation.status == 'valid'
    && birthValidation.status == 'valid'
    && messageValidation.status == 'valid';

  return (<>
    <BasicFormArea>
      <BasicHeader>
        수정 할 정보를 입력해주세요
      </BasicHeader>
      <BasicBody>
        <InputField
          label="이름"
          type="text"
          value={nameForm}
          placeholder="이름을 입력해주세요"
          onChange={(e) => {
            setName(e);
          }}
          helpMessage={nameValidation.text}
          color={nameValidation.status}
        />
        <InputField
          label="생년월일"
          type="text"
          value={birthForm}
          placeholder="생년월일 8자리를 입력해주세요"
          onChange={(e) => {
            setBirth(e);
          }}
          helpMessage={birthValidation.text}
          color={birthValidation.status}
        />
        <InputField
          label="메시지"
          type="text"
          value={messageForm}
          placeholder="메시지를 입력해주세요"
          onChange={(e) => {
            setmessage(e);
          }}
          helpMessage={messageValidation.text}
          color={messageValidation.status}
        />
      </BasicBody>
      <BasicFooter>
        <button
          className={canSubmit() ? "submit" : "submit disable"}
          onClick={click}
        >
          수정하기
        </button>
      </BasicFooter>
    </BasicFormArea>
  </>
  );
}


function nameValid(name: string) {
  // 빈칸일 때
  if (name == "") return { status: 'default', text: "" };

  try {
    validateName(name);
  } catch (error) {
    return { status: 'warn', text: error.message };
  }

  // 통과
  return { status: 'valid', text: "" };
}

function birthValid(birth: string) {
  // 빈칸일 때
  if (birth == "") return { status: 'default', text: "예시) 20020101" };

  try {
    validateBirth(birth);
  } catch (error) {
    return { status: 'warn', text: error.message };
  }

  // 통과
  return { status: 'valid', text: "" };
}

function messageValid(message: string) {
  // 빈칸일 때
  if (message == "") return { status: 'default', text: "" };

  try {
    validateMessage(message);
  } catch (error) {
    return { status: 'warn', text: error.message };
  }

  // 통과
  return { status: 'valid', text: "" };
}