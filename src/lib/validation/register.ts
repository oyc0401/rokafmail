import { knowTime, isDischarged } from "src/lib/time";
import { Validation } from './validation'
import { User } from "src/db";

export function validationGeneration(generation: number): Validation {
  if (isDischarged(Number(generation)))
    return { text: "이미 전역한 기수입니다.", valid: false };

  if (!knowTime(Number(generation)))
    return { text: "입영기수가 아닙니다.", valid: false };

  // 통과
  return { text: "유효한 기수 입니다.", valid: true };
}

export function validationBirth(birth: string): Validation {
  // 숫자가 아닌 문자 입력
  if (!/^\d+$/.test(birth))
    return { text: "숫자만 입력해주세요.", valid: false };

  // 길이
  if (birth.length != 8)
    return {
      text: "생년월일 8자리를 입력해주세요",
      valid: false,
    };

  // 통과
  return { text: "유효한 생년월일 입니다.", valid: true };
}

export function validationPassword(password: string): Validation {
  // 길이
  if (password.length < 4)
    return { text: "비밀번호는 4자리 이상이여야합니다.", valid: false };

  // 통과
  return { text: "유효한 비밀번호 입니다.", valid: true };
}

export function validationSha256Password(password: string): Validation {
  // 길이
  if (password.length != 64)
    return { text: "SHA-256으로 암호화 되지 않았습니다.", valid: false };

  // 통과
  return { text: "유효한 비밀번호 입니다.", valid: true };
}

export function validationName(name: string): Validation {
  // 길이
  if (name.length > 100)
    return { text: "이름은 100자 이하여야합니다.", valid: false };

  // 통과
  return { text: "유효한 이름 입니다.", valid: true };
}

export function validationMessage(message: string): Validation {
  // 길이
  if (message.length > 500)
    return { text: "메시지는 500자 이하여야합니다.", valid: false };

  // 통과
  return { text: "유효한 메시지 입니다.", valid: true };
}

export async function validationUsername(username: string): Promise<Validation> {
  // 중복 체크
  if (await duplicateUsername(username))
    return { text: "중복된 아이디 입니다.", valid: false };

  // 길이
  if (username.length > 100)
    return { text: "아이디는 100자 이하여야합니다.", valid: false };

  // 통과
  return { text: "유효한 아이디 입니다.", valid: true };
}



export async function duplicateUsername(username: string): Promise<boolean> {
  const duplicate = (await User.countUsername(username)) != 0;
  return duplicate;
}