import { describe, expect, test, beforeAll, beforeEach } from '@jest/globals';
import { MailService, SendResponse } from './MailService';
import { LogConfig } from 'config/logger';
import { MemoryLogger } from 'config/memoryLogger';
import { testBean } from '../testConfig';
import { ProfileFactory } from 'src/type/factory';

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

  // 서버 상태 설정
  // 유저 있다고 가정 - 이름, 생년월일, 기수, 소대번호, 멤버번호 필요
  // 편지 객체 생성
  // 편지 보내기
  // 결과 보기
  
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
