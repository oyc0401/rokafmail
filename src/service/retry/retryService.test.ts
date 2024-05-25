import { describe, expect, test, beforeEach, jest } from '@jest/globals';

import { ProfileFactory } from 'src/type/goodFactory';

import { testBean } from '../testConfig';
import { Status } from 'src/lib/time';
import { Trainee } from '../user/Trainee';

describe('Retry Service Test', () => {
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
    generation = 850,
    message = '안녕하세요!'
  } = {}) {
    return { username, password, name, birth, generation, message, }
  }

  describe('retryDelayedMail', () => {
    test('포스트큐에 한개 있을 때', async () => {
      // 서버 상태 좋음
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

      const user = createUserProps();
      const trainee = new Trainee(user);

      // 현재 상태: 훈련 주차
      jest.spyOn(trainee, 'currentStatus').mockReturnValue(Status.training);

      await userService.AsyncRegisterTrainee(trainee);

      // 편지 보내기
      const post = {
        userId: 1,
        name: '유찬', relationship: '친구', title: 'test', contents: 'contents',
        password: '0000', isPublic: true,
        posted: false
      };

      const newPost = await postRepository.insert(post);
      await postQueue.insert(newPost.id);

      await retryService.retryDelayedMail();

      const updatedPost = await postRepository.findById(newPost.id);

      expect(await postQueue.size()).toBe(0);
      expect(updatedPost?.posted).toBe(true);

    });

    test('이미 보낸 편지일 때', async () => {
      // 유저 회원가입
      rokafClient.changeGetProfileReturnValue({
        member: {
          memberSeq: '12341234',
          sodae: '1111',
        },
        serverOn: true,
      });
      const user = {
        username: 'test',
        password: '0000',
        name: '김공군',
        birth: '20030101',
        generation: 857,
        message: '잘 다녀오겠습니다!',
      }
      await userService.register(user);

      // MockRokafClient
      rokafClient.changePostMailReturnValue({
        serverOn: true,
        complete: true,
      });

      const post = {
        userId: 1,
        name: '유찬', relationship: '친구', title: 'test', contents: 'contents',
        password: '0000', isPublic: true,
        posted: true
      };
      const newPost = await postRepository.insert(post);
      await postQueue.insert(newPost.id);

      await retryService.retryDelayedMail();

      const updatedPost = await postRepository.findById(newPost.id);
      if (updatedPost) {
        expect(updatedPost.posted).toBe(true);
      }

      expect(await postQueue.size()).toBe(0);
    });

    test('큐가 비어 있을 때', async () => {
      // 큐가 비어 있는 상태에서 실행
      await retryService.retryDelayedMail();

      expect(await postQueue.size()).toBe(0);
    });

    // test('기훈단 에러 발생 시', async () => {
    //   // 유저 회원가입
    //   rokafClient.changeGetProfileReturnValue({
    //     member: {
    //       memberSeq: '12341234',
    //       sodae: '1111',
    //     },
    //     serverOn: true,
    //   });
    //   const user = {
    //     username: 'test',
    //     password: '0000',
    //     name: '김공군',
    //     birth: '20030101',
    //     generation: 857,
    //     message: '잘 다녀오겠습니다!',
    //   }
    //   await userService.register(user);

    //   // MockRokafClient
    //   rokafClient.changePostMailReturnValue({
    //     serverOn: false,
    //     complete: false,
    //   });

    //   const post = {
    //     userId: 1,
    //     name: '유찬', relationship: '친구', title: 'test', contents: 'contents',
    //     password: '0000', isPublic: true,
    //     posted: false
    //   };

    //   const newPost = await postRepository.insert(post);
    //   await postQueue.insert(newPost.id);

    //   await retryService.retryDelayedMail();

    //   expect(await postQueue.size()).toBe(1);
    // });

    test('유저가 10개 초과의 편지를 보내지 않음', async () => {
      // 유저 회원가입
      rokafClient.changeGetProfileReturnValue({
        member: {
          memberSeq: '12341234',
          sodae: '1111',
        },
        serverOn: true,
      });
      const user = {
        username: 'test',
        password: '0000',
        name: '김공군',
        birth: '20030101',
        generation: 857,
        message: '잘 다녀오겠습니다!',
      }
      await userService.register(user);

      // MockRokafClient
      rokafClient.changePostMailReturnValue({
        serverOn: true,
        complete: true,
      });

      // 15개의 편지 생성
      const posts: any[] = [];
      for (let i = 0; i < 15; i++) {
        const post = {
          userId: 1,
          name: '유찬', relationship: '친구', title: `test${i}`, contents: 'contents',
          password: '0000', isPublic: true,
          posted: false
        };
        const newPost = await postRepository.insert(post);
        await postQueue.insert(newPost.id);
        posts.push(newPost);
      }

      await retryService.retryDelayedMail();

      // 10개는 보내지고, 5개는 다시 큐에 들어가야 함
      expect(await postQueue.size()).toBe(5);

      // 각 편지 상태 확인
      for (let i = 0; i < 15; i++) {
        const updatedPost = await postRepository.findById(posts[i].id);
        if (updatedPost) {
          if (i < 10) {
            expect(updatedPost.posted).toBe(true);
          } else {
            expect(updatedPost.posted).toBe(false);
          }
        }
      }
    });

  })

  describe('retryGetProfile', () => {

    test('유저큐에 한명일 때, 편지 일정개수 이상 보내지 않기', async () => {
      // MockRokafClient
      rokafClient.changeGetProfileReturnValue({
        serverOn: false,
      });
      rokafClient.changePostMailReturnValue({
        serverOn: true,
        complete: true,
      });

      const user = {
        username: 'test',
        password: '0000',
        name: '김공군',
        birth: '20030101',
        generation: 857,
        message: '잘 다녀오겠습니다!',
      }
      const newUser = await userRepository.insert(user);

      // 회원가입
      const profile = ProfileFactory.create({
        userId: newUser.id, name: newUser.id,
        birth: newUser.birth, generation: newUser.generation,
        username: newUser.username,
      });

      await userService.searchProfileFailEnqueue(profile);

      // 인증 전 편지 보내기
      const newPosts: any[] = [];
      for (let i = 0; i < 15; i++) {
        const post = {
          userId: newUser.id,
          name: '유찬', relationship: '친구', title: `test${i}`, contents: 'contents',
          password: '0000', isPublic: true,
        };
        const newPost = await postRepository.insert(post);
        newPosts.push(newPost);
      }

      // 이후에 서버가 정상회 되었음
      rokafClient.changeGetProfileReturnValue({
        member: {
          memberSeq: '12341234',
          sodae: '1111',
        },
        serverOn: true,
      });

      // 작업 시작
      await retryService.retryGetProfile();

      // 인증이 되어서 유저큐는 비어있어야 한다.
      expect(await userQueue.size()).toBe(0);

      for (let i = 0; i < 15; i++) {
        const updated = await postRepository.findById(newPosts[i].id);
        if (updated) {
          if (i < 10) {
            expect(updated.posted).toBe(true);
          } else {
            expect(updated.posted).toBe(false);
          }
        }
      }
    });

    test('큐가 비어 있을 때', async () => {
      // 큐가 비어 있는 상태에서 실행
      await retryService.retryGetProfile();

      expect(await userQueue.size()).toBe(0);
    });

    describe('편지쓰기 기간 지났을 때', () => {
      test('수료했는데 프로필 못 찾으면 큐에 넣지 않기', async () => {
        // MockRokafClient
        rokafClient.changeGetProfileReturnValue({
          serverOn: true,
        });

        const user = {
          username: 'test',
          password: '0000',
          name: '김공군',
          birth: '20030101',
          generation: 850,
          message: '잘 다녀오겠습니다!',
        }
        const newUser = await userRepository.insert(user);

        const profile = ProfileFactory.create({
          userId: newUser.id, name: newUser.id,
          birth: newUser.birth, generation: newUser.generation,
          username: newUser.username,
        });
        jest.spyOn(profile, 'getStatus').mockReturnValue(Status.ending);

        await userService.searchProfileFailEnqueue(profile);
        expect(await userQueue.size()).toBe(0);

        await retryService.retryGetProfile();
        expect(await userQueue.size()).toBe(0);

      });

      test('수료했는데 서버 오류 생겨서 프로필 못 찾으면 큐에 넣기', async () => {
        // MockRokafClient
        rokafClient.changeGetProfileReturnValue({
          serverOn: false,
        });

        const user = {
          username: 'test',
          password: '0000',
          name: '김공군',
          birth: '20030101',
          generation: 850,
          message: '잘 다녀오겠습니다!',
        }
        const newUser = await userRepository.insert(user);

        const profile = ProfileFactory.create({
          userId: newUser.id, name: newUser.id,
          birth: newUser.birth, generation: newUser.generation,
          username: newUser.username,
        });
        jest.spyOn(profile, 'getStatus').mockReturnValue(Status.ending);

        await userService.searchProfileFailEnqueue(profile);
        expect(await userQueue.size()).toBe(1);

        // 나중에 서버 안정화
        rokafClient.changeGetProfileReturnValue({
          serverOn: true,
        });
        await retryService.retryGetProfile();
        expect(await userQueue.size()).toBe(0);

      });

    });



  })

  // 편지 보낼 수 있는 기간에만 보낼 수 있어서 기훈단 오류시 테스트 함수 다시 짜야함

});
