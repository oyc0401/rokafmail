import { describe, expect, test, beforeAll, beforeEach, jest, afterEach } from '@jest/globals';
import { Trainee } from '../user/Trainee';
import { Status } from 'src/lib/time';
import { testBean } from 'src/bean/testConfig';

describe('serviceTest', () => {
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
    generation = 857,
    message = '안녕하세요!'
  } = {}) {
    return { username, password, name, birth, generation, message, }
  }

  function createLetter({ userId = 1, name = '유찬', relationship = '친구',
    title = '제목', contents = 'contents',
    password = '0000', isPublic = true,
  } = {}) {
    return { userId, name, relationship, title, contents, password, isPublic }
  }

  describe('편지 보내기', () => {
    test('편지 보내는 시간에 보내면 편지가 보내집니다.', async () => {
      rokafClient.changeGetProfileReturnValue({
        member: {
          memberSeq: '12341234',
          sodae: '1111',
        },
        serverOn: true,
      });
      rokafClient.changePostMailReturnValue({
        serverOn: true,
        complete: true,
      });

      const userProps = createUserProps();
      const trainee = new Trainee(userProps);
      // 현재 상태: 훈련 주차
      jest.spyOn(trainee, 'currentStatus').mockReturnValue(Status.training);

      const userId = await userService.awaitRegister(trainee);

      // 편지 보내기
      const registeredTrainee = await userService.getTrainee(userId);
      jest.spyOn(registeredTrainee, 'currentStatus').mockReturnValue(Status.training);

      const letter = createLetter({ userId });
      const postId = await mailService.sendLetter(registeredTrainee, letter);
      const resultMail = await postRepository.findById(postId);

      expect(resultMail?.posted).toBe(true);
      expect(await postQueue.size()).toBe(0);
    });

    test('편지 보내기 이전에 보내면 큐에 저장되지 않습니다.', async () => {
      rokafClient.changeGetProfileReturnValue({
        member: {
          memberSeq: '12341234',
          sodae: '1111',
        },
        serverOn: true,
      });
      rokafClient.changePostMailReturnValue({
        serverOn: true,
        complete: true,
      });

      const userProps = createUserProps();
      const trainee = new Trainee(userProps);
      // 현재 상태: 훈련 주차
      jest.spyOn(trainee, 'currentStatus').mockReturnValue(Status.before);

      const userId = await userService.awaitRegister(trainee);

      // 편지 보내기
      const registeredTrainee = await userService.getTrainee(userId);
      jest.spyOn(registeredTrainee, 'currentStatus').mockReturnValue(Status.before);

      const letter = createLetter({ userId });
      const postId = await mailService.sendLetter(registeredTrainee, letter);
      const resultMail = await postRepository.findById(postId);

      expect(resultMail?.posted).toBe(false);
      expect(await postQueue.size()).toBe(0);
    });

    test('훈련병 프로필이 없으면 편지를 보내지 않고 큐에 넣지 않습니다.', async () => {
      rokafClient.changeGetProfileReturnValue({
        serverOn: false,
      });
      rokafClient.changePostMailReturnValue({
        serverOn: true,
        complete: true,
      });

      const userProps = createUserProps();
      const trainee = new Trainee(userProps);
      // 현재 상태: 훈련 주차
      jest.spyOn(trainee, 'currentStatus').mockReturnValue(Status.training);

      const userId = await userService.awaitRegister(trainee);

      // 편지 보내기
      const registeredTrainee = await userService.getTrainee(userId);
      jest.spyOn(registeredTrainee, 'currentStatus').mockReturnValue(Status.training);

      const letter = createLetter({ userId });
      const postId = await mailService.sendLetter(registeredTrainee, letter);
      const resultMail = await postRepository.findById(postId);

      expect(resultMail?.posted).toBe(false);
      expect(await postQueue.size()).toBe(0);
    });

    test('서버에 오류가 생기면 편지를 보내지 않고 큐에 넣습니다.', async () => {
      rokafClient.changeGetProfileReturnValue({
        member: {
          memberSeq: '12341234',
          sodae: '1111',
        },
        serverOn: true,
      });
      rokafClient.changePostMailReturnValue({
        serverOn: false,
        complete: false,
      });

      const userProps = createUserProps();
      const trainee = new Trainee(userProps);
      // 현재 상태: 훈련 주차
      jest.spyOn(trainee, 'currentStatus').mockReturnValue(Status.training);

      const userId = await userService.awaitRegister(trainee);

      // 편지 보내기
      const registeredTrainee = await userService.getTrainee(userId);
      jest.spyOn(registeredTrainee, 'currentStatus').mockReturnValue(Status.training);

      const letter = createLetter({ userId });
      const postId = await mailService.sendLetter(registeredTrainee, letter);
      const resultMail = await postRepository.findById(postId);

      expect(resultMail?.posted).toBe(false);
      expect(await postQueue.size()).toBe(1);
    });

    test('편지를 보내기 실패하면 큐에 넣습니다.', async () => {
      rokafClient.changeGetProfileReturnValue({
        member: {
          memberSeq: '12341234',
          sodae: '1111',
        },
        serverOn: true,
      });
      rokafClient.changePostMailReturnValue({
        serverOn: true,
        complete: false,
      });

      const userProps = createUserProps();
      const trainee = new Trainee(userProps);
      // 현재 상태: 훈련 주차
      jest.spyOn(trainee, 'currentStatus').mockReturnValue(Status.training);

      const userId = await userService.awaitRegister(trainee);

      // 편지 보내기
      const registeredTrainee = await userService.getTrainee(userId);
      jest.spyOn(registeredTrainee, 'currentStatus').mockReturnValue(Status.training);

      const letter = createLetter({ userId });
      const postId = await mailService.sendLetter(registeredTrainee, letter);
      const resultMail = await postRepository.findById(postId);

      expect(resultMail?.posted).toBe(false);
      expect(await postQueue.size()).toBe(1);
    });

    test('프로필이 있으면 편지시간 이후에 보내면 서버 안거치고 보내졌다고 친다 1', async () => {
      rokafClient.changeGetProfileReturnValue({
        member: {
          memberSeq: '12341234',
          sodae: '1111',
        },
        serverOn: true,
      });
      rokafClient.changePostMailReturnValue({
        serverOn: true,
        complete: true,
      });

      const userProps = createUserProps();
      const trainee = new Trainee(userProps);
      // 현재 상태: 훈련 주차
      jest.spyOn(trainee, 'currentStatus').mockReturnValue(Status.working);

      const userId = await userService.awaitRegister(trainee);

      // 편지 보내기
      const registeredTrainee = await userService.getTrainee(userId);
      jest.spyOn(registeredTrainee, 'currentStatus').mockReturnValue(Status.working);

      const letter = createLetter({ userId });
      const postId = await mailService.sendLetter(registeredTrainee, letter);
      const resultMail = await postRepository.findById(postId);

      expect(resultMail?.posted).toBe(true);
      expect(await postQueue.size()).toBe(0);
    });

    test('프로필이 있으면 편지시간 이후에 보내면 서버 안거치고 보내졌다고 친다 2', async () => {
      rokafClient.changeGetProfileReturnValue({
        member: {
          memberSeq: '12341234',
          sodae: '1111',
        },
        serverOn: true,
      });
      rokafClient.changePostMailReturnValue({
        serverOn: false,
        complete: true,
      });

      const userProps = createUserProps();
      const trainee = new Trainee(userProps);
      // 현재 상태: 훈련 주차
      jest.spyOn(trainee, 'currentStatus').mockReturnValue(Status.working);

      const userId = await userService.awaitRegister(trainee);

      // 편지 보내기
      const registeredTrainee = await userService.getTrainee(userId);
      jest.spyOn(registeredTrainee, 'currentStatus').mockReturnValue(Status.working);

      const letter = createLetter({ userId });
      const postId = await mailService.sendLetter(registeredTrainee, letter);
      const resultMail = await postRepository.findById(postId);

      expect(resultMail?.posted).toBe(true);
      expect(await postQueue.size()).toBe(0);
    });

    test('프로필이 있으면 편지시간 이후에 보내면 서버 안거치고 보내졌다고 친다 3', async () => {
      rokafClient.changeGetProfileReturnValue({
        member: {
          memberSeq: '12341234',
          sodae: '1111',
        },
        serverOn: true,
      });
      rokafClient.changePostMailReturnValue({
        serverOn: true,
        complete: false,
      });

      const userProps = createUserProps();
      const trainee = new Trainee(userProps);
      // 현재 상태: 훈련 주차
      jest.spyOn(trainee, 'currentStatus').mockReturnValue(Status.working);

      const userId = await userService.awaitRegister(trainee);

      // 편지 보내기
      const registeredTrainee = await userService.getTrainee(userId);
      jest.spyOn(registeredTrainee, 'currentStatus').mockReturnValue(Status.working);

      const letter = createLetter({ userId });
      const postId = await mailService.sendLetter(registeredTrainee, letter);
      const resultMail = await postRepository.findById(postId);

      expect(resultMail?.posted).toBe(true);
      expect(await postQueue.size()).toBe(0);
    });

    test('편지시간 지나도 유저 프로필이 없으면 편지를 보내지 않는다.', async () => {
      rokafClient.changeGetProfileReturnValue({
        serverOn: false,
      });
      rokafClient.changePostMailReturnValue({
        serverOn: true,
        complete: false,
      });

      const userProps = createUserProps();
      const trainee = new Trainee(userProps);
      // 현재 상태: 훈련 주차
      jest.spyOn(trainee, 'currentStatus').mockReturnValue(Status.working);

      const userId = await userService.awaitRegister(trainee);

      // 편지 보내기
      const registeredTrainee = await userService.getTrainee(userId);
      jest.spyOn(registeredTrainee, 'currentStatus').mockReturnValue(Status.working);

      const letter = createLetter({ userId });
      const postId = await mailService.sendLetter(registeredTrainee, letter);
      const resultMail = await postRepository.findById(postId);

      expect(resultMail?.posted).toBe(false);
      expect(await postQueue.size()).toBe(0);
    });

  })


  describe('유저의 미발송 편지 보내기', () => {
    beforeEach(() => {
      // 가짜 타이머 사용 설정
      jest.useFakeTimers();
      // 862기 훈련기간
      jest.setSystemTime(new Date('2024-11-01T00:00:00.000Z'));
    });

    afterEach(() => {
      // 가짜 타이머 사용 해제
      jest.useRealTimers();
    });

    // 유저 프로필을 얻어오면 해당 유저의 미발송 편지를 보내는데, 거기에 활용됌
    test('미발송 편지 보내기를 하면 해당 유저의 모든 미발송 편지를 다시 보냅니다.', async () => {
      // 서버 상태 양호
      rokafClient.changeGetProfileReturnValue({
        member: {
          memberSeq: '12341234',
          sodae: '1111',
        },
        serverOn: true,
      });
      rokafClient.changePostMailReturnValue({
        serverOn: true,
        complete: true,
      });

      const userProps = createUserProps({ generation: 862 });
      const trainee = new Trainee(userProps);

      // 현재 상태: 입대 전
      jest.spyOn(trainee, 'currentStatus').mockReturnValue(Status.training);
      const userId = await userService.awaitRegister(trainee);

      // 편지 저장, 편지쓰기 기간 아니라 그냥 편지만 저장함
      const letter = createLetter({ userId });
      const { id: postId } = await postRepository.insert(letter);

      // 미발송 편지 보내기
      await mailService.sendUnpostedMails(userId);

      // 결과 검증
      const updated = await postRepository.findById(postId);
      expect(updated!.posted).toBe(true);
    });

    test('미발송 편지 보내기는 편지를 보내는 최대 개수가 정해져있음. 나머지는 큐에 저장됌', async () => {
      // 서버 상태 양호
      rokafClient.changeGetProfileReturnValue({
        member: {
          memberSeq: '12341234',
          sodae: '1111',
        },
        serverOn: true,
      });
      rokafClient.changePostMailReturnValue({
        serverOn: true,
        complete: true,
      });

      const userProps = createUserProps({ generation: 862 });
      const trainee = new Trainee(userProps);

      // 현재 상태: 훈련 주차
      jest.spyOn(trainee, 'currentStatus').mockReturnValue(Status.training);
      const userId = await userService.awaitRegister(trainee);

      // 편지 보내기, 실패해서 큐에 넣어짐
      const registeredTrainee = await userService.getTrainee(userId);
      jest.spyOn(registeredTrainee, 'currentStatus').mockReturnValue(Status.training);


      // 편지 15개 보내기
      const POST_COUNT = 15;
      const postIdList: any[] = [];
      for (let i = 0; i < POST_COUNT; i++) {
        // 편지 저장, 편지쓰기 기간 아니라 그냥 편지만 저장함
        const letter = createLetter({ userId });
        const { id: postId } = await postRepository.insert(letter);
        postIdList.push(postId)
      }

      // 미발송 편지 보내기
      await mailService.sendUnpostedMails(userId);

      // 최대 제한인 편지 10개만 보내진다.
      for (let i = 0; i < POST_COUNT; i++) {
        const updated = await postRepository.findById(postIdList[i]);
        if (i < 10) {
          expect(updated!.posted).toBe(true);
        } else {
          expect(updated!.posted).toBe(false);
        }
      }

      // 남은 편지는 큐에 저장되어 나중에 보내집니다.
      expect(await postQueue.size()).toBe(5);
    });

  })


})
