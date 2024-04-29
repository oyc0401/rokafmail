import { describe, expect, test } from '@jest/globals';
import MockRokafApiClient from './MockRokafApiClient';

describe('rokaf api client test', () => {

  test('Post Mail', async () => {
    const rokafApiClient = new MockRokafApiClient();

    const profile = await rokafApiClient.getProfile('이름', '12341234');

    expect(1).toBe(1);
  });

  test('테스트 이름', () => {
    expect(1).toBe(1);
  });
})
