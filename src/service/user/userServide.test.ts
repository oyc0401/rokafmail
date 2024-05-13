import { describe, expect, test, beforeEach } from '@jest/globals';
import MockRokafClient from '../rokafClient/MockRokafClient';
import { MemoryUserRepository } from 'src/repository/user/memoryUserRepository';
import { UserService, syncResponse } from './UserService';
import { MemoryUserQueue } from 'src/repository/userQueue/memoryUserQueue';
import { ProfileFactory } from 'src/type/factory';
import { LogConfig } from 'config/logger';
import { MemoryLogger } from 'config/memoryLogger';
import { MemoryPostRepository } from 'src/repository/post/memoryPostRepository';
import { MemoryPostQueue } from 'src/repository/postQueue/memoryPostQueue';
import { MailService } from '../mail/MailService';
import { MemoryUnidentifiedUserRepository } from 'src/repository/unidentifiedUserRepository/memoryUnidentifiedUserRepository';

describe('User Service Test', () => {


  let postRepository = new MemoryPostRepository();
  let postQueue = new MemoryPostQueue();
  const rokafClient = new MockRokafClient();
  let mailService = new MailService({ postRepository, postQueue, rokafClient });

  let userRepository = new MemoryUserRepository();
  let userQueue = new MemoryUserQueue();
  let unidentifiedUserRepository = new MemoryUnidentifiedUserRepository();

  let userService = new UserService({ userRepository, userQueue, rokafClient, mailService, unidentifiedUserRepository });

  beforeEach(() => {
    postRepository = new MemoryPostRepository();
    postQueue = new MemoryPostQueue();
    mailService = new MailService({ postRepository, postQueue, rokafClient });

    userRepository = new MemoryUserRepository();
    userQueue = new MemoryUserQueue();
    unidentifiedUserRepository = new MemoryUnidentifiedUserRepository();

    userService = new UserService({ userRepository, userQueue, rokafClient, mailService, unidentifiedUserRepository });
  });


  test('syncProfile before test', async () => {
    const user = await userRepository.insert({
      username: 'test',
      password: '0000',
      name: '김공군',
      birth: '20030101',
      generation: 858,
      message: '잘 다녀오겠습니다!',
    });

    // MockRokafClient 준비
    rokafClient.forcedSetGetProfileResponse({
      member: {
        memberSeq: '12341234',
        sodae: '1111',
      },
      serverOn: true,
    });

    const profile = ProfileFactory.create({
      userId: user.id, name: user.id,
      birth: user.birth, generation: user.generation,
      username: user.username,
    });

    const response = await userService.syncProfile(profile);

    expect(response).toBe(syncResponse.before);
  });


  test('syncProfile complete test', async () => {
    const logger = new MemoryLogger();
    LogConfig.setLogger(logger);
    
    const user = await userRepository.insert({
      username: 'test',
      password: '0000',
      name: '김공군',
      birth: '20030101',
      generation: 856,
      message: '잘 다녀오겠습니다!',
    });

    // MockRokafClient 준비
    rokafClient.forcedSetGetProfileResponse({
      member: {
        memberSeq: '12341234',
        sodae: '1111',
      },
      serverOn: true,
    });

    const profile = ProfileFactory.create({
      userId: user.id, name: user.id,
      birth: user.birth, generation: user.generation,
      username: user.username,
    });

    const response = await userService.syncProfile(profile);

    expect(response).toBe(syncResponse.complete);
  });

  test('syncProfile error test', async () => {
    const logger = new MemoryLogger();
    LogConfig.setLogger(logger);

    const user = await userRepository.insert({
      username: 'test',
      password: '0000',
      name: '김공군',
      birth: '20030101',
      generation: 856,
      message: '잘 다녀오겠습니다!',
    });

    // MockRokafClient 준비
    rokafClient.forcedSetGetProfileResponse({
      serverOn: false,
    });

    const profile = ProfileFactory.create({
      userId: user.id, name: user.id,
      birth: user.birth, generation: user.generation,
      username: user.username,
    });

    const response = await userService.syncProfile(profile);

    expect(response).toBe(syncResponse.error);
  });

  test('syncProfile fail test', async () => {
    const logger = new MemoryLogger();
    LogConfig.setLogger(logger);

    const user = await userRepository.insert({
      username: 'test',
      password: '0000',
      name: '김공군',
      birth: '20030101',
      generation: 856,
      message: '잘 다녀오겠습니다!',
    });

    // MockRokafClient 준비
    rokafClient.forcedSetGetProfileResponse({
      serverOn: true,
    });

    const profile = ProfileFactory.create({
      userId: user.id, name: user.id,
      birth: user.birth, generation: user.generation,
      username: user.username,
    });

    const response = await userService.syncProfile(profile);

    expect(response).toBe(syncResponse.fail);
  });

  test('테스트 이름', () => {
    expect(1).toBe(1);
    expect(1).toEqual(1);
  });
});