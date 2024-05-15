import { ValidateError } from "./validateErrorType";

export function validateContent(content: string) {
  if (content.length > 1200) {
    throw new ValidateError("내용은 1200자를 넘을 수 없습니다.");
  }
}
export function validateTitle(title: string) {
  if (title.length > 300) {
    throw new ValidateError("제목은 300자를 넘을 수 없습니다.");
  }
}
export function validateWriter(writer: string) {
  if (writer.length > 100) {
    throw new ValidateError("이름은 100자 이하여야합니다.");
  }
}

export function validateRelationship(relationship: string) {
  if (relationship.length > 100) {
    throw new ValidateError("관계는 100자 이하여야합니다.");
  }
}