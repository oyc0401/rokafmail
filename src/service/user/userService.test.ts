import { describe, expect, test, beforeEach, jest } from '@jest/globals';
import { UserService, syncResponse } from './UserService';
import { ProfileFactory } from 'src/type/goodFactory';
import { ValidateError } from 'src/utils/validate';
import { Status } from 'src/lib/time';
import { testBean } from '../testConfig';
import { Trainee } from './Trainee';

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

  function createUserProps({
    username = 'testUser',
    password = 'password123',
    name = '홍길동',
    birth = '19900101',
    generation = 858,
    message = '안녕하세요!'
  } = {}) {
    return { username, password, name, birth, generation, message, }
  }

  describe('Trainee 회원가입', () => {
    test('회원가입', async () => {
      const userProps = createUserProps();
      const trainee = new Trainee(userProps);

      const userId = await userService.AsyncRegisterTrainee(trainee);

      const registeredTrainee = await userService.getTrainee(userId);

      const user = await userRepository.findByUsername(registeredTrainee.username);
      expect(user).not.toBeNull();
    });

    test('아이디 중복이면 회원가입이 실패합니다.', async () => {
      // 회원가입
      const userProps1 = createUserProps({ username: 'Michael' });
      const trainee1 = new Trainee(userProps1);
      await userService.AsyncRegisterTrainee(trainee1);

      // 중복된 아이디
      const userProps2 = createUserProps({ username: 'Michael' });
      const trainee2 = new Trainee(userProps2);

      // 오류 예상
      await expect(userService.AsyncRegisterTrainee(trainee2)).rejects.toThrow(ValidateError);
    });


    test.each([
      ['입대 전', Status.before],
      ['초반 주차', Status.beginning]
    ])(
      '%s 상태에서는 프로필 검색을 하지 않는다.',
      async (description, status) => {
        const userProps = createUserProps();
        const trainee = new Trainee(userProps);

        jest.spyOn(trainee, 'currentStatus').mockReturnValue(status);

        rokafClient.changeGetProfileReturnValue({
          member: {
            memberSeq: '12341234',
            sodae: '1111',
          },
          serverOn: true,
        });

        // 회원가입
        const userId = await userService.AsyncRegisterTrainee(trainee);
        const registeredTrainee = await userService.getTrainee(userId);

        // 프로필 업데이트 여부 검증
        expect(registeredTrainee.memberSeq).toBeNull();
        expect(registeredTrainee.sodae).toBeNull();

        // 인증 전이므로 유저큐에 들어간다.
        expect(await userQueue.size()).toBe(1);
      }
    );

    test('회원가입 시 훈련주차에는 프로필을 가져온다.', async () => {
      const userProps = createUserProps();
      const trainee = new Trainee(userProps);

      // 현재 상태: 훈련 주차
      jest.spyOn(trainee, 'currentStatus').mockReturnValue(Status.training);

      rokafClient.changeGetProfileReturnValue({
        member: {
          memberSeq: '12341234',
          sodae: '1111',
        },
        serverOn: true,
      });

      // 회원가입
      const userId = await userService.AsyncRegisterTrainee(trainee);

      const registeredTrainee = await userService.getTrainee(userId);

      // 소대번호를 업데이트 한다.
      expect(registeredTrainee.memberSeq).toEqual('12341234');
      expect(registeredTrainee.sodae).toEqual('1111');
    });
  });

  describe('syncProfile 테스트', () => {

    test('syncProfile - before status', async () => {
      const userProps = createUserProps();
      const trainee = new Trainee(userProps);
      // 현재 상태: 훈련 주차
      jest.spyOn(trainee, 'currentStatus').mockReturnValue(Status.training);

      // db 저장
    

      const result = await userService.syncProfileTrainee(user!.id, registeredTrainee);

      expect(result).toBe(syncResponse.before);

      // 유저 정보 검증
      const updatedUser = await userRepository.findById(user!.id);
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

});

