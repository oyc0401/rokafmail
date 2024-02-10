"use client";
import styles from "./register.module.css";
import { useStore, useStoreBase } from "./model";
import { knowTime, isDischarged } from "src/lib/time";

import { InputField, BasicArea } from "src/components";
export default function Information() {
  const { generation, name, birth, setGeneration, setName, setBirth, next } =
    useStoreBase();

  const canSubmit = () =>
    validG(generation).valid && validN(name).valid && validB(birth).valid;

  const click = () => {
    if (canSubmit()) next();
  };

  const generationValidation = validG(generation);
  const nameValidation = validN(name);
  const birthValidation = validB(birth);
  return (
    <>
      <BasicArea
        header={
          <div className="pt-12 pb-12 w-full">
            <h2 className={styles.title}>
              편지 주소를 확인하기 위해
              <br />
              이름과 생년월일이 필요해요
            </h2>
          </div>
        }
        body={
          <>
            <InputField
              label="기수"
              placeholder="기수를 입력해주세요 예시) 850"
              value={generation}
              onChange={setGeneration}
              helpMessage={generationValidation.text}
              color={generationValidation.color}
            ></InputField>

            <InputField
              label="이름"
              placeholder="이름을 입력해주세요"
              value={name}
              onChange={setName}
              helpMessage={nameValidation.text}
              color={nameValidation.color}
            ></InputField>
            <InputField
              label="생년월일"
              placeholder="생년월일 8자리를 입력해주세요"
              value={birth}
              onChange={setBirth}
              helpMessage={birthValidation.text}
              color={birthValidation.color}
            ></InputField>
          </>
        }
        footer={
          <button
            className={canSubmit() ? "submit" : "submit disable"}
            onClick={click}
          >
            다음
          </button>
        }
      ></BasicArea>
    </>
  );
}

function validG(generation) {
  // 빈칸일 때
  if (generation == "") return { text: "예시) 850", valid: false };

  // 숫자가 아닌 다른문자 입력
  if (!/^\d+$/.test(generation))
    return { text: "숫자만 입력해주세요", color: "warn", valid: false };

  // 작성중
  if (Number(generation) < 100) return { text: "예시) 850", valid: false };

  if (isDischarged(Number(generation)))
    return { text: "이미 전역한 기수예요", color: "warn", valid: false };

  if (!knowTime(Number(generation)))
    return { text: "입영기수가 아니예요", color: "warn", valid: false };

  // 통과
  return { text: "예시) 850", valid: true };
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
