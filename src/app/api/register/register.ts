"use server";
import { asyncRegister } from "./asyncRegister";
import { User } from "src/db";
import { ServerActionResponse } from ".././serverActionResponse";
import { makeLogger } from "config/winston";
import { duplicateUsername, validB, validG } from "./valid";
const logger = makeLogger("register");


/**
 * 입력 검증: 사용자의 세대, 생일, 아이디 중복, 비밀번호 길이, 이름 길이, 메시지 길이를 검증합니다.
 * 유저 생성: 검증을 통과하면 사용자 정보를 데이터베이스에 저장합니다.
 * 사용자 확인: 저장된 사용자 정보를 바탕으로, 국방부 사이트에서 사용자의 존재 여부를 확인합니다.
 * 상태에 따른 처리: 사용자의 세대에 따라 국방부 사이트에서의 존재 여부를 확인하고, 존재 여부에 따라 사용자를 UserQueue에 추가하거나 사용자 정보를 업데이트합니다.
 */
export async function registerApi(registerForm: {
  username: string;
  password: string;
  name: string;
  birth: string;
  generation: number;
  message: string;
}) {
  try {
    // 입력 검증
    const validationResult = await validateInput(registerForm);
    if (!validationResult.validate) {
      return ServerActionResponse.json({
        message: validationResult.message,
        status: 400,
      });
    }

    // 유저 생성
    const { id } = await User.insert(registerForm);

    // 빠른 응답을 위해 남은 로직은 비동기에서 진행
    asyncRegister(id);

    return ServerActionResponse.json({ message: "회원가입 성공", status: 200 });
  } catch (error) {
    logger.error(`회원가입 처리 중 오류 발생: ${error}`);
    return ServerActionResponse.json({ message: "서버 오류", status: 500 });
  }
}



async function validateInput({
  username,
  password,
  name,
  birth,
  generation,
  message,
}) {
  if (!validG(generation).valid)
    return { message: validG(generation).text, validate: false };
  if (!validB(birth).valid)
    return { message: validB(birth).text, validate: false };
  if (await duplicateUsername(username))
    return { message: "아이디가 중복되었습니다.", validate: false };
  if (password.length < 4)
    return { message: "비밀번호는 4자리 이상이여야합니다.", validate: false };
  if (name.length > 100)
    return { message: "이름은 100자 이하여야합니다.", validate: false };
  if (message.length > 500)
    return { message: "메시지는 500자 이하여야합니다.", validate: false };

  return { message: "유효한 데이터 형식입니다.", validate: true };
}
