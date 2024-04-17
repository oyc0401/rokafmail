import { describe, expect, test } from '@jest/globals';
import { getEnter } from "./time";

describe('time 라이브러리', () => {
  test('850기', () => {
    const a = getEnter(850)
    expect(a.format('YYYY-MM-DD HH:mm:ss')).toBe('2023-08-14 00:00:00');
  });
})
