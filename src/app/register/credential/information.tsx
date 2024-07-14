"use client";
import { useStoreBase } from "./model";
import {
  InputField,
  BasicFormArea,
  BasicHeader,
  BasicBody,
  BasicFooter,
} from "src/components";
import { RecommendGeneration } from "src/lib/time/recommendDate";
import { validateBirth, validateGeneration, validateName } from "src/utils/validate";
export default function Information() {
  const { generation, name, birth, setGeneration, setName, setBirth, next } =
    useStoreBase();

  const click = (event) => {
    event.preventDefault();
    if (!canSubmit()) return;

    if (canSubmit()) next();
  };

  const generationValidation = generationValid(generation);
  const nameValidation = nameValid(name);
  const birthValidation = birthValid(birth);

  const canSubmit = () =>
    generationValidation.status == 'valid'
    && nameValidation.status == 'valid'
    && birthValidation.status == 'valid'

  return (
    <>
      <BasicFormArea>
        <BasicHeader>
          회원가입을 위해 훈련병의
          <br />
          정보를 작성해주세요
        </BasicHeader>
        <BasicBody paddingBottom={false}>
          <div className="flex flex-col h-full">
            <div className="pb-12 w-full">
              <InputField
                label="기수"
                placeholder={`기수를 입력해주세요 예시) ${RecommendGeneration.getGeneration()}`}
                value={generation}
                onChange={setGeneration}
                helpMessage={generationValidation.text}
                color={generationValidation.status}
              />
              <InputField
                label="이름"
                placeholder="이름을 입력해주세요"
                value={name}
                onChange={setName}
                helpMessage={nameValidation.text}
                color={nameValidation.status}
              />
              <InputField
                label="생년월일"
                placeholder="생년월일 8자리를 입력해주세요"
                value={birth}
                onChange={setBirth}
                helpMessage={birthValidation.text}
                color={birthValidation.status}
              />
            </div>
            <div style={{ flex: 1 }}></div>
            <p className="text-sm text-fontmedium">
              다음을 누르시면 <a href="/privacy-policy" target="_blank" className="underline">개인정보처리방침</a>에 동의합니다
            </p>
          </div>
        </BasicBody>
        <BasicFooter>
          <button
            className={canSubmit() ? "submit" : "submit disable"}
            onClick={click}
          >
            다음
          </button>
        </BasicFooter>
      </BasicFormArea>
    </>
  );
}

function generationValid(generation: string) {
  // 빈칸일 때
  if (generation == "")
    return { status: 'default', text: `예시) ${RecommendGeneration.getGeneration()}` };

  if (!/^\d+$/.test(generation))
    return { status: 'warn', text: '숫자만 입력해주세요' };

  // 작성중
  if (Number(generation) < 100)
    return { status: 'default', text: `예시) ${RecommendGeneration.getGeneration()}` };

  try {
    validateGeneration(Number(generation));
  } catch (error) {
    return { status: 'warn', text: error.message };
  }

  // 통과
  return { status: 'valid', text: `가입 가능한 기수 입니다.` };
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

