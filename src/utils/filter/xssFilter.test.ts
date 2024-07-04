import { describe, expect, test } from '@jest/globals';

import { filter, validateAttack } from './filter';
import { ValidateError } from '../validate';


//var SqlString = require('sqlstring')

describe('rokaf api client test', () => {


  test('공격을 감지하면 에러를 던집니다.', () => {
    // 검사할 문자열 예시입니다.
    let dirtyMessage = `/* 안녕하세요'''''--- ' OR 1=1 -- -' */`;

    expect(() => validateAttack(dirtyMessage)).toThrow(ValidateError);
  });

})
