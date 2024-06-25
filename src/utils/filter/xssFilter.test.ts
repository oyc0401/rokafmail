import { describe, expect, test } from '@jest/globals';
import xss from 'xss';
import { filter } from './filter';
import SqlString from 'sqlstring'

//var SqlString = require('sqlstring')

describe('rokaf api client test', () => {

  test('Post Mail', async () => {

    // 검사할 문자열 예시입니다.
    const dirtyHTML = `<script>alert('xss');</script><div>안전한 내용</div>`;

    // xss 함수를 사용하여 안전한 HTML을 생성합니다.
    const cleanHTML = xss(dirtyHTML);

    expect(cleanHTML).toBe(`&lt;script&gt;alert('xss');&lt;/script&gt;<div>안전한 내용</div>`);
  });

  test('테스트 이름', () => {
    // 검사할 문자열 예시입니다.
    const dirtyMesage = `' OR 1=1 -- -'`;

    const clean = SqlString.escape(dirtyMesage)

    expect(clean).toBe(`'\\' OR 1=1 -- -\\''`);
  });


  // test('테스트 이름', () => {
  //   // 검사할 문자열 예시입니다.
  //   let dirtyMesage = `/* 안녕하세요'''''--- ' OR 1=1 -- -' */`;

  //   let clean = filter(dirtyMesage)
  //   console.log(clean);

  //   expect(clean).toBe('56');
  // });

})
