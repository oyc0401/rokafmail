import { describe, expect, test, beforeAll, beforeEach } from '@jest/globals';
import { MailService, SendResponse } from './MailService';
import { MemoryPostRepository } from 'src/repository/post/memoryPostRepository';
import MockRokafClient from '../rokafClient/MockRokafClient';
import { MemoryPostQueue } from 'src/repository/postQueue/memoryPostQueue';
import { LogConfig } from 'config/logger';
import { MemoryLogger } from 'config/memoryLogger';
import { MemoryUserRepository } from 'src/repository/user/memoryUserRepository';

describe('serviceTest', () => {
  const rokafClient = new MockRokafClient();

  let postRepository = new MemoryPostRepository();
  let postQueue = new MemoryPostQueue(postRepository);
  let mailService = new MailService({ postRepository, postQueue, rokafClient });

  let userRepository = new MemoryUserRepository();

  postRepository.join(userRepository);

  beforeEach(async () => {
    postRepository = new MemoryPostRepository();
    postQueue = new MemoryPostQueue(postRepository);
    mailService = new MailService({ postRepository, postQueue, rokafClient });

    userRepository = new MemoryUserRepository();

    postRepository.join(userRepository);

  })


  beforeAll(() => {
    const logger = new MemoryLogger();
    LogConfig.setLogger(logger);
  })


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

  test('MailService 실패 상황', async () => {
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
    expect(sendStatus).toBe(SendResponse.fail);
  });


  test('MailService 편지 큐', async () => {
    const logger = new MemoryLogger();
    LogConfig.setLogger(logger);

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

    // postQueue 설정
    await postQueue.insert(newPost.id)

    // when
    await mailService.retryDelayedMail();

    // then
    const resultPost = await postRepository.findById(newPost.id);

    expect(resultPost!.posted).toBe(true);

    expect(await postQueue.empty()).toEqual(true);
    expect(resultPost!.postAt).not.toBe(null);

    console.log(logger.cat());
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
    // const items = [
    //   { id: 1, postId: 11, userId: 1 },
    //   { id: 2, postId: 12, userId: 1 },
    //   { id: 3, postId: 13, userId: 1 },
    //   { id: 4, postId: 14, userId: 1 },
    //   { id: 5, postId: 15, userId: 1 }
    // ];
    // expect(postQueue.postQueue).toEqual(items);


  });

  test('테스트 이름', () => {
    expect(1).toBe(1);
    expect(1).toEqual(1);
  });
})
