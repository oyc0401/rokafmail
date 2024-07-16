"use server";

import { makeLogger } from "config/winston";
import { ValidateError, validateBirth, validateGeneration, validateHashedPassword, validateMessage, validateName, validateUsername } from "src/utils/validate";
import { RegisterProps } from "src/server/service/user/UserService";
import { bean } from "src/server/bean/bean";
import { ActionResponse } from "src/lib/actionResponse";
import { Trainee } from "src/type/serviceType";
import { auth } from "src/auth";
const logger = makeLogger("Register");

/**
 * `Server Action`
 * 
 * 회원가입을 한다.
 * @status `200` `400`
 */
export async function register(registerProps: RegisterProps, password: string) {
  const { userService } = bean;

  try {
    // 입력 검증
    validateInput(registerProps);
    validateHashedPassword(password);

    const exist = await userService.existUsername(registerProps.username);
    if (exist) {
      return ActionResponse.badRequest("아이디가 중복되었습니다.");
    }

    const trainee: Trainee = registerProps
    await userService.registerCredential(trainee, registerProps.password, true);

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
  name,
  birth,
  generation,
  message,
}: RegisterProps) {
  validateUsername(username);
  validateGeneration(generation);
  validateBirth(birth);
  validateName(name);
  validateMessage(message);
}


export async function registerGoogle(registerProps: RegisterProps, uid: string) {
  const { userService } = bean;

  try {

    const session = await auth();
    if (session?.user.uid != uid) {
      return ActionResponse.badRequest("로그인을 다시 해주세요.");
    }

    // 입력 검증
    validateInput(registerProps);

    const exist = await userService.existUsername(registerProps.username);
    if (exist) {
      return ActionResponse.badRequest("아이디가 중복되었습니다.");
    }

    const trainee: Trainee = registerProps
    await userService.registerGoogle(trainee, uid, true);

    session.user.username = registerProps.username;
    session.user.name = registerProps.name;

    return ActionResponse.ok("회원가입 성공");
  } catch (error) {
    if (error instanceof ValidateError) {
      return ActionResponse.badRequest(`${error.message}`);
    }
    logger.error(`회원가입 처리 중 오류 발생: ${error}`);
    return ActionResponse.internalServerError(error.message);
  }
}
