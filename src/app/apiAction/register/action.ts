"use server";
import { ServerActionResponse } from "../serverActionResponse";
import { makeLogger } from "config/winston";
import { ValidateError, validateBirth, validateGeneration, validateHashedPassword, validateMessage, validateName, validateUsername } from "src/utils/validate";
import { RegisterProps } from "src/service/user/UserService";
import { bean } from "src/bean/bean";
import { Trainee } from "src/service/user/Trainee";
const logger = makeLogger("register");

export async function registerApi(registerProps: RegisterProps) {
  const { userService } = bean;

  try {
    // 입력 검증
    validateInput(registerProps);

    const exist = await userService.existUsername(registerProps.username);
    if (exist) {
      return ServerActionResponse.json({
        message: "아이디가 중복되었습니다.",
        status: 400,
      });
    }

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
