"use server";
import { ServerActionResponse } from ".././serverActionResponse";
import { makeLogger } from "config/winston";
import { ValidateError, validateBirth, validateGeneration, validateHashedPassword, validateMessage, validateName, validateUsername } from "src/utils/validate";
import { RegisterProps, UserService } from "src/service/user/UserService";
import { bean } from "src/bean/bean";
import { duplicateUsername } from "./duplicateUsername/serverAction";
import { Trainee } from "src/service/user/Trainee";
const logger = makeLogger("register");

/**
 * 입력 검증: 사용자의 세대, 생일, 아이디 중복, 비밀번호 길이, 이름 길이, 메시지 길이를 검증합니다.
 * 유저 생성: 검증을 통과하면 사용자 정보를 데이터베이스에 저장합니다.
 * 사용자 확인: 저장된 사용자 정보를 바탕으로, 국방부 사이트에서 사용자의 존재 여부를 확인합니다.
 * 상태에 따른 처리: 사용자의 세대에 따라 국방부 사이트에서의 존재 여부를 확인하고, 존재 여부에 따라 사용자를 UserQueue에 추가하거나 사용자 정보를 업데이트합니다.
 */
export async function registerApi(registerProps: RegisterProps) {
  try {
    // 입력 검증
    validateInput(registerProps);

    if (await duplicateUsername(registerProps.username)) {
      return ServerActionResponse.json({
        message: "아이디가 중복되었습니다.",
        status: 400,
      });
    }

    const userService = new UserService(bean);
    const trainee = new Trainee(registerProps);
    await userService.register(trainee);

    return ServerActionResponse.json({ message: "회원가입 성공", status: 200 });
  } catch (error) {
    if (error instanceof ValidateError) {
      return ServerActionResponse.json({ message: `${error.message}`, status: 400 });
    }
    logger.error(`회원가입 처리 중 오류 발생: ${error}`);
    return ServerActionResponse.json({ message: `서버 오류: ${error}`, status: 500 });
  }
}



function validateInput({
  username,
  password,
  name,
  birth,
  generation,
  message,
}: RegisterProps) {
  validateUsername(username);
  validateHashedPassword(password);
  validateGeneration(generation);
  validateBirth(birth);
  validateName(name);
  validateMessage(message);
}
