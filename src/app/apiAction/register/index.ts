"use server";

import { makeLogger } from "config/winston";
import { ValidateError, validateBirth, validateGeneration, validateHashedPassword, validateMessage, validateName, validateUsername } from "src/utils/validate";
import { RegisterProps } from "src/service/user/UserService";
import { bean } from "src/bean/bean";
import { ActionResponse } from "src/app/apiSSR/actionResponse";
import { Trainee } from "src/service/user/Trainee";
const logger = makeLogger("Register");

/**
 * `Server Action`
 * 
 * 회원가입을 한다.
 * @status `200` `400`
 */
export async function register(registerProps: RegisterProps) {
  const { userService } = bean;

  try {
    // 입력 검증
    validateInput(registerProps);

    const exist = await userService.existUsername(registerProps.username);
    if (exist) {
      return ActionResponse.badRequest("아이디가 중복되었습니다.");
    }

    const trainee: Trainee = registerProps
    await userService.register(trainee);

    return ActionResponse.ok("회원가입 성공");
  } catch (error) {
    if (error instanceof ValidateError) {
      return ActionResponse.badRequest(`${error.message}`);
    }
    logger.error(`회원가입 처리 중 오류 발생: ${error}`);
    return ActionResponse.internalServerError(error.message);
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
