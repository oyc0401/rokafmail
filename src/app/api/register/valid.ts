
import { User } from "src/db";
import { knowTime, isDischarged } from "src/lib/time";


export function validG(generation:number) {
  // 작성중
  if (Number(generation) < 100) return { text: "예시) 850", valid: false };

  if (isDischarged(Number(generation)))
    return { text: "이미 전역한 기수예요", color: "warn", valid: false };

  if (!knowTime(Number(generation)))
    return { text: "입영기수가 아니예요", color: "warn", valid: false };

  // 통과
  return { text: "예시) 850", valid: true };
}



export function validB(birth:string) {

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

export async function duplicateUsername(username) {
  console.log("아이디 중복확인 중...");
  const duplicate = (await User.countUsername(username)) != 0;
  console.log("아이디 중복확인 완료!", !duplicate);

  //중복이면 true

  return duplicate;
}
