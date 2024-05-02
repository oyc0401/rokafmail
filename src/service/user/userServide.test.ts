import { describe, expect, test } from '@jest/globals';
import MockRokafClient from '../rokafClient/MockRokafClient';
import { MemoryUserRepository } from 'src/repository/user/memoryUserRepository';
import { UserService, syncResponse } from './UserService';
import { MemoryUserQueue } from 'src/repository/userQueue/memoryUserQueue';
import { ProfileFactory } from 'src/type/factory';

describe('User Service Test', () => {

  test('syncProfile before test', async () => {
    const userRepository = new MemoryUserRepository();
    const user = await userRepository.insert({
      username: 'test',
      password: '0000',
      name: '김공군',
      birth: '20030101',
      generation: 858,
      message: '잘 다녀오겠습니다!',
    });

    const userQueue = new MemoryUserQueue();

    // MockRokafClient 준비
    const rokafClient = new MockRokafClient();
    rokafClient.forcedSetPostMailResponse({
      serverOn: true,
      complete: false,
    });

    const userService = new UserService({ userRepository, userQueue, rokafClient });

    const profile = ProfileFactory.create({
      userId: user.id, name: user.id,
      birth: user.birth, generation: user.generation,
      username: user.username,
    });

    const response = await userService.syncProfile(profile);

    expect(response).toBe(syncResponse.before);

    expect(1).toEqual(1);
  });

  test('테스트 이름', () => {
    expect(1).toBe(1);
    expect(1).toEqual(1);
  });
});