import { describe, expect, test } from '@jest/globals';
import { MailService, SendResponse } from './MailService';
import { MemoryPostRepository } from 'src/repository/post/memoryPostRepository';
import MockRokafClient from '../rokafClient/MockRokafClient';
import { PrismaPostQueueRepository } from 'src/repository/postQueue/prismaPostQueueRepository';
import { MemoryPostQueueRepository } from 'src/repository/postQueue/memoryPostQueueRepository';

describe('serviceTest', () => {

  test('mail service before', async () => {
    // MockRokafClient 준비
    const rokafClient = new MockRokafClient();
    rokafClient.forcedSetPostMailResponse({
      serverOn: true,
      complete: true,
    });

    // 메모리 리포지토리 설정
    let postRepository = new MemoryPostRepository();
    const post = {
      name: '유찬', relationship: '친구', title: '제목', contents: 'contents',
      password: '0000', createdAt: new Date(), postAt: null, posted: false,
      user: {
        generation: 862,
        sodae: '1234',
        memberSeq: '12341234',
      }
    };

    const newPost = await postRepository.insert(post);
    const postQueueRepository = new MemoryPostQueueRepository();

    // 메일 서비스 인스턴스화 및 메일 전송 시도
    const mailService = new MailService({ postRepository, postQueueRepository, rokafClient });
    const response = await mailService.sendMail(newPost.id);

    // 결과 검증
    expect(response).toBe(SendResponse.before);
  });

  test('mail service 성공', async () => {
    // MockRokafClient 준비
    const rokafClient = new MockRokafClient();
    rokafClient.forcedSetPostMailResponse({
      serverOn: true,
      complete: true,
    });

    // 메모리 리포지토리 설정
    let postRepository = new MemoryPostRepository();
    const post = {
      name: '유찬', relationship: '친구', title: '제목', contents: 'contents',
      password: '0000', createdAt: new Date(), postAt: null, posted: false,
      user: {
        generation: 856,
        sodae: '1234',
        memberSeq: '12341234',
      }
    };
    const newPost = await postRepository.insert(post);

    const postQueueRepository = new MemoryPostQueueRepository();

    // 메일 서비스 인스턴스화 및 메일 전송 시도
    const mailService = new MailService({ postRepository, postQueueRepository, rokafClient });
    const response = await mailService.sendMail(newPost.id);

    // 결과 검증
    expect(response).toBe(SendResponse.success);

    // 보내졌다고 업데이트
    const updated = await postRepository.findById(newPost.id);
    expect(updated.posted).toBe(true);
  });

  test('MailService 실패 상황', async () => {
    // MockRokafClient 준비
    const rokafClient = new MockRokafClient();
    rokafClient.forcedSetPostMailResponse({
      serverOn: true,
      complete: false,
    });

    // 메모리 리포지토리 설정
    let postRepository = new MemoryPostRepository();
    const post = {
      name: '유찬', relationship: '친구', title: '제목', contents: 'contents',
      password: '0000', createdAt: new Date(), postAt: null, posted: false,
      user: {
        generation: 856,
        sodae: '1234',
        memberSeq: '12341234',
      }
    };
    const newPost = await postRepository.insert(post);

    const postQueueRepository = new MemoryPostQueueRepository();

    // 메일 서비스 인스턴스화 및 메일 전송 시도
    const mailService = new MailService({ postRepository, postQueueRepository, rokafClient });
    const sendStatus = await mailService.sendMail(newPost.id);

    // 결과 검증
    expect(sendStatus).toBe(SendResponse.fail);
  });


  test('MailService 편지 큐', async () => {
    // MockRokafClient 준비
    const rokafClient = new MockRokafClient();
    rokafClient.forcedSetPostMailResponse({
      serverOn: true,
      complete: true,
    });

    // 메모리 리포지토리 설정
    let postRepository = new MemoryPostRepository();
    const post = {
      name: '유찬', relationship: '친구', title: '제목', contents: 'contents',
      password: '0000', createdAt: new Date(), postAt: null, posted: false,
      user: {
        id: 1,
        generation: 856,
        sodae: '1234',
        memberSeq: '12341234',
      }
    };
    const newPost = await postRepository.insert(post);

    // postQueueRepository 설정
    const postQueueRepository = new MemoryPostQueueRepository();
    postQueueRepository.join(postRepository);

    postQueueRepository.insert({ postId: newPost.id, userId: newPost.user.id })

    // when
    const mailService = new MailService({ postRepository, postQueueRepository, rokafClient });
    await mailService.traversePostQueue();

    // then
    const resultPost = await postRepository.findById(newPost.id);

    expect(resultPost.posted).toBe(true);

    expect(await postQueueRepository.findAll()).toEqual([]);
    expect(resultPost.postAt).not.toBe(null);
  });

  test('테스트 이름', () => {
    expect(1).toBe(1);
    expect(1).toEqual(1);
  });
})
