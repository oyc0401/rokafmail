import { describe, expect, test } from '@jest/globals';
import {
  validateGeneration,
  validateBirth,
  validateUsername,
  validatePassword,
  validateHashedPassword,
  validateName,
  validateMessage
} from './userValitate';
import { ValidateError } from './validateErrorType';

describe('입력 폼 유효성 검사', () => {
  // 이름 검증
  describe('validateName', () => {
    test('정상적인 이름', () => {
      expect(() => validateName('홍길동')).not.toThrow();
    });

    test('이름이 50자를 초과', () => {
      expect(() => validateName('a'.repeat(51))).toThrow(ValidateError);
    });

    test('이름 끝에 공백 포함', () => {
      expect(() => validateName('홍길동 ')).toThrow(ValidateError);
    });
  });

  // 생년월일 검증
  describe('validateBirth', () => {
    test('올바른 생년월일', () => {
      expect(() => validateBirth('19901231')).not.toThrow();
    });

    test('숫자가 아닌 문자 포함', () => {
      expect(() => validateBirth('1990abcd')).toThrow(ValidateError);
    });

    test('8자리가 아닌 경우', () => {
      expect(() => validateBirth('1990123')).toThrow(ValidateError);
    });
  });

  // 사용자명 검증
  describe('validateUsername', () => {
    test('정상적인 사용자명', () => {
      expect(() => validateUsername('user123')).not.toThrow();
    });

    test('사용자명 50자 초과', () => {
      expect(() => validateUsername('u'.repeat(51))).toThrow(ValidateError);
    });

    test('사용자명 끝에 공백 포함', () => {
      expect(() => validateUsername('user123 ')).toThrow(ValidateError);
    });
  });

  // 비밀번호 검증
  describe('validatePassword', () => {
    test('올바른 비밀번호', () => {
      expect(() => validatePassword('pass123')).not.toThrow();
    });

    test('비밀번호가 4자 미만', () => {
      expect(() => validatePassword('pas')).toThrow(ValidateError);
    });

    test('비밀번호 끝에 공백 포함', () => {
      expect(() => validatePassword('pass123 ')).toThrow(ValidateError);
    });
  });

  // 해시된 비밀번호 검증
  describe('validateHashedPassword', () => {
    test('올바른 SHA-256 해시', () => {
      expect(() => validateHashedPassword('1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef')).not.toThrow();
    });

    test('SHA-256 형식이 아닌 경우', () => {
      expect(() => validateHashedPassword('12345')).toThrow(Error);
    });
  });

  // 메시지 검증
  describe('validateMessage', () => {
    test('정상적인 메시지', () => {
      expect(() => validateMessage('Hello, this is a test message.')).not.toThrow();
    });

    test('메시지가 500자 초과', () => {
      expect(() => validateMessage('a'.repeat(501))).toThrow(ValidateError);
    });
  });

  describe('validateGeneration 특정 케이스 테스트', () => {
    test('400기수는 이미 전역', () => {
      // 400기수는 이미 전역했다고 가정 (isDischarged 가 true를 반환)
      // 해당 부분은 실제로 함수가 올바른 결과를 반환한다고 가정하고 작성한 것이므로, 실제 함수 구현에 따라 다를 수 있습니다.
      expect(() => validateGeneration(400)).toThrow("이미 전역한 기수예요");
    });

    test('856기수는 성공', () => {
      // 856기수는 성공적으로 검증 (isDischarged 가 false이고, knowTime이 true를 반환)
      expect(() => validateGeneration(856)).not.toThrow();
    });

    test('1000기수는 DB에 없음', () => {
      // 1000기수는 DB에 없다고 가정 (knowTime 가 false를 반환)
      expect(() => validateGeneration(1000)).toThrow("입영기수가 아니예요");
    });
  });
});