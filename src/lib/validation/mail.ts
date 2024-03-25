import { Validation } from './validation'

export function validationPassword(password: string): Validation {
  // 길이
  if (password.length < 4)
    return { text: "비밀번호는 4자리 이상이여야합니다.", valid: false };

  // 통과
  return { text: "유효한 비밀번호 입니다.", valid: true };
}

export function validationContent(content: string): Validation {
  // 길이
  if (content.length > 1200)
    return { text: "내용은 1200자를 넘을 수 없습니다.", valid: false };

  // 통과
  return { text: "유효한 내용 입니다.", valid: true };
}

export function validationTitle(title: string): Validation {
  // 길이
  if (title.length > 300)
    return { text: "제목은 300자를 넘을 수 없습니다.", valid: false };

  // 통과
  return { text: "유효한 제목 입니다.", valid: true };
}

export function validationName(name: string): Validation {
  // 길이
  if (name.length > 100)
    return { text: "이름은 100자 이하여야합니다.", valid: false };

  // 통과
  return { text: "유효한 이름 입니다.", valid: true };
}

export function validationRelationship(relationship: string): Validation {
  // 길이
  if (relationship.length > 100)
    return { text: "관계는 100자 이하여야합니다.", valid: false };

  // 통과
  return { text: "유효한 관계 입니다.", valid: true };
}