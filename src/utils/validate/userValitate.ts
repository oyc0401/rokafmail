import { knowTime, isDischarged } from "src/lib/time";
import { ValidateError } from "./validateErrorType";

export function validateGeneration(generation: number) {
  if (isDischarged(generation)) throw new ValidateError("이미 전역한 기수예요");
  if (!knowTime(generation)) throw new ValidateError("입영기수가 아니예요");
}

export function validateBirth(birth: string) {
  // 숫자가 아닌 문자 입력
  if (!/^\d+$/.test(birth)) throw new ValidateError("숫자만 입력해주세요.");

  // 8자리
  if (birth.length != 8) throw new ValidateError("생년월일 8자리를 입력해주세요");
}
export function validateUsername(username: string) {
  if (username.length == 0) throw new ValidateError("아이디를 입력해주세요.");

  if (username.length > 50) throw new ValidateError("아이디는 50자 미만이여야합니다.");

  if (username !== username.trim()) {
    throw new ValidateError("아이디 끝에 띄어쓰기를 포함할 수 없습니다.");
  }
}

export function validatePassword(password: string) {
  if (password.length < 8) throw new ValidateError("비밀번호는 8자리 이상이여야합니다.");

  if (password !== password.trim()) {
    throw new ValidateError("비밀번호에 띄어쓰기를 포함할 수 없습니다.");
  }
}

export function validateHashedPassword(hashedPassword: string) {
  // 정규 표현식을 사용하여 64자리 16진수 문자열인지 확인
  const sha256Regex = /^[a-fA-F0-9]{64}$/;

  if (!sha256Regex.test(hashedPassword)) {
    throw new Error("비밀번호 해시가 유효한 SHA-256 형식이 아닙니다.");
  }
}

export function validateName(name: string) {
  if (name.length == 0) throw new ValidateError("비밀번호를 입력해주세요.");

  if (name.length > 50) {
    throw new ValidateError("이름은 50자 미만이여야합니다.");
  }
  if (name !== name.trim()) {
    throw new ValidateError("이름 끝에 띄어쓰기를 포함할 수 없습니다.");
  }
}
export function validateMessage(message: string) {
  if (message.length == 0) throw new ValidateError("메시지를 입력해주세요.");

  if (message.length > 500) {
    throw new ValidateError("메시지는 500자 미만이여야합니다.");
  }
}
