import { describe, expect, test } from '@jest/globals';
import MockRokafClient from './MockRokafClient';

describe('rokaf api client test', () => {

  test('Post Mail', async () => {
    const rokafClient = new MockRokafClient();

    const profile = await rokafClient.getProfile('이름', '12341234');

    expect(1).toBe(1);
  });

  test('테스트 이름', () => {
    expect(1).toBe(1);
  });
})
