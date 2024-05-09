"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { editProfile } from "src/app/api/profile/profile";
import { BasicBody, BasicFooter, BasicFormArea, BasicHeader, InputField } from "src/components";

export function Client({ username, name, birth, message }) {
  const [nameForm, setName] = useState(name);
  const [birthForm, setBirth] = useState(birth);
  const [messageForm, setmessage] = useState(message);
  const canSubmit = () =>
    validM(messageForm).valid &&
    validN(nameForm).valid &&
    validB(birthForm).valid;

  const router = useRouter();

  const click = async (e) => {
    e.preventDefault();
    const response = await editProfile(
      username,
      nameForm,
      birthForm,
      messageForm,
    );
    if (response.status == 200) {
      router.push("/profile");
      router.refresh();
    } else {
      alert(`error: ${response.status} ${response.error}`);
    }
  };

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
          helpMessage={validN(nameForm).text}
          color={validN(nameForm).color}
        />
        <InputField
          label="생년월일"
          type="text"
          value={birthForm}
          placeholder="생년월일 8자리를 입력해주세요"
          onChange={(e) => {
            setBirth(e);
          }}
          helpMessage={validB(birthForm).text}
          color={validB(birthForm).color}
        />
        <InputField
          label="메시지"
          type="text"
          value={messageForm}
          placeholder="메시지를 입력해주세요"
          onChange={(e) => {
            setmessage(e);
          }}
          helpMessage={validM(messageForm).text}
          color={validM(messageForm).color}
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

function validM(message) {
  // 빈칸일 때
  if (message == "") return { text: "", valid: false };

  // 너무 많을 때
  if (50 < message.length)
    return { text: "글이 너무 길어요", color: "warn", valid: false };

  // 통과
  return { text: "", color: "great", valid: true };
}

function validN(name) {
  // 빈칸일 때
  if (name == "") return { text: "", valid: false };

  // 통과
  return { text: "", color: "great", valid: true };
}

function validB(birth) {
  // 빈칸일 때
  if (birth == "") return { text: "예시) 20020101", valid: false };

  // 숫자가 아닌 문자 입력
  if (!/^\d+$/.test(birth))
    return { text: "숫자만 입력해주세요.", color: "warn", valid: false };

  // 8자리 미만
  if (birth.length < 8) return { text: "예시) 20020101", valid: false };

  // 8자리 초과
  if (birth.length > 8)
    return {
      text: "생년월일 8자리를 입력해주세요",
      color: "warn",
      valid: false,
    };

  // 통과
  return { text: "예시) 20020101", valid: true };
}
