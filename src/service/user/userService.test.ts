import { describe, expect, test, beforeEach, jest } from '@jest/globals';
import { UserService, syncResponse } from './UserService';
import { ProfileFactory } from 'src/type/factory';
import { ValidateError } from 'src/utils/validate';
import { Status } from 'src/lib/time';
import { testBean } from '../testConfig';

describe('User Service Test', () => {
  let {
    postRepository, userRepository, postQueue, userQueue,
    rokafClient, mailService, userService, retryService,
    logger,
  } = testBean();

  beforeEach(() => {
    ({
      postRepository, userRepository, postQueue, userQueue,
      rokafClient, mailService, userService, retryService,
      logger
    } = testBean());
  });

  describe('회원가입 테스트', () => {
    test('성공적인 회원가입 테스트', async () => {
      // Username 'testUser'가 중복되지 않음을 가정
      jest.spyOn(userService, 'existUsername').mockResolvedValue(false);

      const registerProps = {
        username: 'testUser',
        password: 'password123',
        name: '홍길동',
        birth: '19900101',
        generation: 858,
        message: '안녕하세요!'
      };

      // 회원가입 요청
      await userService.register(registerProps);

      // UserRepository에 정상적으로 추가되었는지 확인
      const newUser = await userRepository.findByUsername('testUser');
      expect(newUser).not.toBeNull();

      expect(newUser?.username).toEqual('testUser');
      expect(newUser?.name).toEqual('홍길동');

    });

    test('아이디 중복으로 인한 회원가입 실패 테스트', async () => {
      // Username 'duplicateUser'가 중복된다고 가정
      jest.spyOn(userService, 'existUsername').mockResolvedValue(true);

      const registerProps = {
        username: 'duplicateUser',
        password: 'password123',
        name: '홍길동',
        birth: '19900101',
        generation: 858,
        message: '안녕하세요!'
      };

      // 오류 예상
      await expect(userService.register(registerProps)).rejects.toThrow(ValidateError);
    });

  })

  describe('syncProfile 테스트', () => {

    test('syncProfile - before status', async () => {
      const user = await userRepository.insert({
        username: 'test',
        password: '0000',
        name: '김공군',
        birth: '20030101',
        generation: 858,
        message: '잘 다녀오겠습니다!',
      });
      const { generation, name, birth, id, username } = user;
      const profile = ProfileFactory.create({ userId: id, generation, name, birth, username });
      jest.spyOn(profile, 'getStatus').mockReturnValue(Status.before);
      rokafClient.changeGetProfileReturnValue({
        member: {
          memberSeq: '12341234',
          sodae: '1111',
        },
        serverOn: true,
      });

      const result = await userService.syncProfile(profile);

      expect(result).toBe(syncResponse.before);

      // 유저 정보 검증
      const updatedUser = await userRepository.findById(profile.userId);
      expect(updatedUser?.connect).toBe(false);
    });

    test('syncProfile - server error', async () => {
      const user = await userRepository.insert({
        username: 'test',
        password: '0000',
        name: '김공군',
        birth: '20030101',
        generation: 857,
        message: '잘 다녀오겠습니다!',
      });

      const profile = ProfileFactory.FromUser(user);
      jest.spyOn(profile, 'getStatus').mockReturnValue(Status.working);
      rokafClient.setRokafServerError();

      const result = await userService.syncProfile(profile);

      expect(result).toBe(syncResponse.error);

      // 유저 정보 검증
      const updatedUser = await userRepository.findById(profile.userId);
      expect(updatedUser?.connect).toBe(false);
    });

    test('syncProfile - complete response', async () => {
      const user = await userRepository.insert({
        username: 'test',
        password: '0000',
        name: '김공군',
        birth: '20030101',
        generation: 858,
        message: '잘 다녀오겠습니다!',
      });
      const profile = ProfileFactory.FromUser(user);
      jest.spyOn(profile, 'getStatus').mockReturnValue(Status.working);
      rokafClient.changeGetProfileReturnValue({
        member: {
          memberSeq: '12341234',
          sodae: '1111',
        },
        serverOn: true,
      });

      const result = await userService.syncProfile(profile);

      expect(result).toBe(syncResponse.complete);

      // 유저 정보 검증
      const updatedUser = await userRepository.findById(profile.userId);
      expect(updatedUser?.connect).toBe(true);
      expect(updatedUser?.memberSeq).toBe('12341234');
      expect(updatedUser?.sodae).toBe('1111');
    });

    test('syncProfile - fail response when no member data', async () => {
      const user = await userRepository.insert({
        username: 'test',
        password: '0000',
        name: '김공군',
        birth: '20030101',
        generation: 858,
        message: '잘 다녀오겠습니다!',
      });
      const profile = ProfileFactory.FromUser(user);
      jest.spyOn(profile, 'getStatus').mockReturnValue(Status.working);
      rokafClient.changeGetProfileReturnValue({
        serverOn: true
      });

      const result = await userService.syncProfile(profile);

      expect(result).toBe(syncResponse.fail);

      // 유저 정보 검증
      const updatedUser = await userRepository.findById(profile.userId);
      expect(updatedUser?.connect).toBe(false);
    });
  });


  test('테스트 이름', () => {
    expect(1).toBe(1);
    expect(1).toEqual(1);
  });
});

