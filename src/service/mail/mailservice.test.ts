import { describe, expect, test, beforeAll, beforeEach, jest } from '@jest/globals';
import { MailService, SendResponse } from './MailService';
import { LogConfig } from 'config/logger';
import { MemoryLogger } from 'config/memoryLogger';
import { testBean } from '../testConfig';
import { Trainee } from '../user/Trainee';
import { Status } from 'src/lib/time';

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


  beforeAll(() => {
    const logger = new MemoryLogger();
    LogConfig.setLogger(logger);
  })

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








  test('편지 보내는 시간 이전', async () => {
    // 서버 상태 설정
    rokafClient.changePostMailReturnValue({
      serverOn: true,
      complete: true,
    });

    const newUser = await userRepository.insert({
      generation: 863,
      message: '하이',
      name: '김공군',
      password: '123213',
      username: 'rokaf',
      birth: '20034001',
    });

    await userRepository.updateRokafProfile(newUser.id, {
      memberSeq: '12341234',
      sodae: '1234'
    });

    const post = {
      userId: 1, name: '유찬', relationship: '친구',
      title: '제목', contents: 'contents',
      password: '0000', isPublic: true,
    }

    const newPost = await postRepository.insert(post);


    // 메일 전송 시도
    const response = await mailService.sendMail(newPost.id);

    // 결과 검증
    expect(response).toBe(SendResponse.before);
  });


  test('mail service before', async () => {
    // MockRokafClient
    rokafClient.changePostMailReturnValue({
      serverOn: true,
      complete: true,
    });

    // 메모리 리포지토리 설정
    const newUser = await userRepository.insert({
      generation: 863,
      message: '하이',
      name: '김공군',
      password: '123213',
      username: 'rokaf',
      birth: '20034001',
    });

    await userRepository.updateRokafProfile(newUser.id, {
      memberSeq: '12341234',
      sodae: '1234'
    });

    const post = {
      userId: 1, name: '유찬', relationship: '친구',
      title: '제목', contents: 'contents',
      password: '0000', isPublic: true,
    }

    const newPost = await postRepository.insert(post);


    // 메일 서비스 인스턴스화 및 메일 전송 시도
    const response = await mailService.sendMail(newPost.id);

    // 결과 검증
    expect(response).toBe(SendResponse.before);
  });

  test('mail service 성공', async () => {
    // MockRokafClient 준비
    rokafClient.changePostMailReturnValue({
      serverOn: true,
      complete: true,
    });

    // 메모리 리포지토리 설정

    const newUser = await userRepository.insert({
      generation: 850,
      message: '하이',
      name: '김공군',
      password: '123213',
      username: 'rokaf',
      birth: '20034001',
    });

    await userRepository.updateRokafProfile(newUser.id, {
      memberSeq: '12341234',
      sodae: '1234'
    });

    const post = {
      userId: 1, name: '유찬', relationship: '친구',
      title: '제목', contents: 'contents',
      password: '0000', isPublic: true,
    }

    const newPost = await postRepository.insert(post);

    // 메일 서비스 인스턴스화 및 메일 전송 시도
    const response = await mailService.sendMail(newPost.id);

    // 결과 검증
    expect(response).toBe(SendResponse.success);

    // 보내졌다고 업데이트
    const updated = await postRepository.findById(newPost.id);
    expect(updated!.posted).toBe(true);
  });

  // 편지 보낼 수 있는 기간에만 보낼 수 있어서 함수 다시 짜야함
  // test('MailService 실패 상황', async () => {
  //   // MockRokafClient 준비
  //   rokafClient.changePostMailReturnValue({
  //     serverOn: true,
  //     complete: false,
  //   });

  //   // 메모리 리포지토리 설정
  //   const newUser = await userRepository.insert({
  //     generation: 857,
  //     message: '하이',
  //     name: '김공군',
  //     password: '123213',
  //     username: 'rokaf',
  //     birth: '20034001',
  //   });

  //   await userRepository.updateRokafProfile(newUser.id, {
  //     memberSeq: '12341234',
  //     sodae: '1234'
  //   });


  //   const post = {
  //     userId: 1, name: '유찬', relationship: '친구',
  //     title: '제목', contents: 'contents',
  //     password: '0000', isPublic: true,
  //   }

  //   const newPost = await postRepository.insert(post);

  //   // 메일 서비스 인스턴스화 및 메일 전송 시도
  //   const sendStatus = await mailService.sendMail(newPost.id);

  //   // 결과 검증
  //   expect(sendStatus).toBe(SendResponse.fail);
  // });

  test('MailService 편지 시간 지나면 그냥 성공', async () => {
    // MockRokafClient 준비
    rokafClient.changePostMailReturnValue({
      serverOn: true,
      complete: false,
    });

    // 메모리 리포지토리 설정
    const newUser = await userRepository.insert({
      generation: 850,
      message: '하이',
      name: '김공군',
      password: '123213',
      username: 'rokaf',
      birth: '20034001',
    });

    await userRepository.updateRokafProfile(newUser.id, {
      memberSeq: '12341234',
      sodae: '1234'
    });


    const post = {
      userId: 1, name: '유찬', relationship: '친구',
      title: '제목', contents: 'contents',
      password: '0000', isPublic: true,
    }

    const newPost = await postRepository.insert(post);

    // 메일 서비스 인스턴스화 및 메일 전송 시도
    const sendStatus = await mailService.sendMail(newPost.id);

    // 결과 검증
    expect(sendStatus).toBe(SendResponse.success);
  });

  test('sendUnpostedMails 테스트', async () => {
    // MockRokafClient 준비
    rokafClient.changePostMailReturnValue({
      serverOn: true,
      complete: true,
    });
    const newUser = await userRepository.insert({
      generation: 850,
      message: '하이',
      name: '김공군',
      password: '123213',
      username: 'rokaf',
      birth: '20034001',
    });

    await userRepository.updateRokafProfile(newUser.id, {
      memberSeq: '12341234',
      sodae: '1234'
    });

    // 메모리 리포지토리 설정
    const post = {
      userId: 1, name: '유찬', relationship: '친구',
      title: '제목', contents: 'contents',
      password: '0000', isPublic: true,
    }
    const newPost = await postRepository.insert(post);

    // then
    await mailService.sendUnpostedMails(post.userId);

    // 결과 검증
    const updated = await postRepository.findById(newPost.id);
    expect(updated!.posted).toBe(true);
  });

  test('sendUnpostedMails 한계 테스트', async () => {
    // MockRokafClient 준비
    rokafClient.changePostMailReturnValue({
      serverOn: true,
      complete: true,
    });
    const newUser = await userRepository.insert({
      generation: 850,
      message: '하이',
      name: '김공군',
      password: '123213',
      username: 'rokaf',
      birth: '20034001',
    });

    await userRepository.updateRokafProfile(newUser.id, {
      memberSeq: '12341234',
      sodae: '1234'
    });


    // 메모리 리포지토리 설정
    const posts: any[] = [];
    for (let i = 0; i < 15; i++) {
      const post = {
        userId: 1, name: '유찬', relationship: '친구', title: `test${i}`, contents: 'contents',
        password: '0000', createdAt: new Date(), postAt: null, posted: false,
      };

      posts.push(post)
    }

    const newPosts: any[] = [];
    for (let i = 0; i < 15; i++) {
      const newPost = await postRepository.insert(posts[i]);
      newPosts.push(newPost);
    }


    // then
    await mailService.sendUnpostedMails(posts[0].userId);

    // 결과 검증
    for (let i = 0; i < 15; i++) {
      const updated = await postRepository.findById(newPosts[i].id);
      if (i < 10) {
        expect(updated!.posted).toBe(true);
      } else {
        expect(updated!.posted).toBe(false);
      }
    }

  });


})
