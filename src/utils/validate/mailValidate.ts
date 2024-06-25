import { attackValidate } from "../filter/filter";
import { ValidateError } from "./validateErrorType";

export function validateContent(content: string) {
  if (!attackValidate(content)) {
    throw new ValidateError("해당 내용을 작성할 수 없습니다.");
  }
  if (content.length > 1200) {
    throw new ValidateError("내용은 1200자를 넘을 수 없습니다.");
  }
}
export function validateTitle(title: string) {
  if (!attackValidate(title)) {
    throw new ValidateError("해당 내용을 작성할 수 없습니다.");
  }
  if (title.length > 50) {
    throw new ValidateError("제목은 50자를 넘을 수 없습니다.");
  }
}
export function validateWriter(writer: string) {
  if (!attackValidate(writer)) {
    throw new ValidateError("해당 내용을 작성할 수 없습니다.");
  }
  if (writer == 'sh' || writer == 'SH' || writer == 'Sh') {
    throw new ValidateError("해당 내용을 작성할 수 없습니다.");
  }
  if (writer.length > 50) {
    throw new ValidateError("이름은 50자 이하여야합니다.");
  }
}

export function validateRelationship(relationship: string) {
  if (!attackValidate(relationship)) {
    throw new ValidateError("해당 내용을 작성할 수 없습니다.");
  }
  if (relationship.length > 50) {
    throw new ValidateError("관계는 50자 이하여야합니다.");
  }
}

export function validateMailPassword(password: string) {
  if (password.length < 4) throw new ValidateError("비밀번호는 4자리 이상이여야합니다.");
  if (password.length > 50) {
    throw new ValidateError("비밀번호는 50자 이하여야합니다.");
  }
  if (password !== password.trim()) {
    throw new ValidateError("비밀번호에 띄어쓰기를 포함할 수 없습니다.");
  }
  if (!attackValidate(password)) {
    throw new ValidateError("해당 내용을 작성할 수 없습니다.");
  }
}