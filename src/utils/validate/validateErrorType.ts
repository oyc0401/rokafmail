export class ValidateError extends Error {
  constructor(message) {
    super(message); // 부모 클래스의 생성자를 호출
    this.name = "ValidateError"; // 오류 이름 설정
  }
}