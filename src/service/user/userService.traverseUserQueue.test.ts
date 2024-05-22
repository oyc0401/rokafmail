// import { describe, expect, test, beforeAll } from '@jest/globals';
// import MockRokafClient from '../rokafClient/MockRokafClient';
// import { MemoryUserRepository } from 'src/repository/user/memoryUserRepository';
// import { UserService, syncResponse } from './UserService';
// import { MemoryUserQueue } from 'src/repository/userQueue/memoryUserQueue';
// import { ProfileFactory } from 'src/type/factory';
// import { LogConfig } from 'config/logger';
// import { MemoryLogger } from 'config/memoryLogger';
// import { before, beforeEach } from 'node:test';
// import { MemoryPostRepository } from 'src/repository/post/memoryPostRepository';
// import { MemoryPostQueue } from 'src/repository/postQueue/memoryPostQueue';
// import { MailService } from '../mail/MailService';

// describe('User Service Test', () => {
//   const rokafClient = new MockRokafClient();

//   let postRepository = new MemoryPostRepository();
//   let postQueue = new MemoryPostQueue(postRepository);
//   let mailService = new MailService({ postRepository, postQueue, rokafClient });

//   let userRepository = new MemoryUserRepository();
//   let userQueue = new MemoryUserQueue(userRepository);
//   let userService = new UserService({ userRepository, userQueue, rokafClient, mailService });

//   postRepository.join(userRepository);

//   beforeEach(() => {
//     postRepository = new MemoryPostRepository();
//     postQueue = new MemoryPostQueue(postRepository);
//     mailService = new MailService({ postRepository, postQueue, rokafClient });

//     userRepository = new MemoryUserRepository();
//     userQueue = new MemoryUserQueue(userRepository);
//     userService = new UserService({ userRepository, userQueue, rokafClient, mailService });

//     postRepository.join(userRepository);
//   });

//   beforeAll(() => {
//     const logger = new MemoryLogger();
//     LogConfig.setLogger(logger);
//   })

//   test('traverseUserQueue() 유저큐에 한명일 때', async () => {
//     const logger = new MemoryLogger();
//     LogConfig.setLogger(logger);

//     // MockRokafClient
//     rokafClient.changeGetProfileReturnValue({
//       serverOn: false,
//     });
//     rokafClient.changePostMailReturnValue({
//       serverOn: true,
//       complete: true,
//     });

//     const user = {
//       username: 'test',
//       password: '0000',
//       name: '김공군',
//       birth: '20030101',
//       generation: 857,
//       message: '잘 다녀오겠습니다!',
//     }
//     const newUser = await userRepository.insert(user);

//     // 회원가입
//     const profile = ProfileFactory.create({
//       userId: newUser.id, name: newUser.id,
//       birth: newUser.birth, generation: newUser.generation,
//       username: newUser.username,
//     });

//     await userService.searchProfileFailEnqueue(profile);

//     // 인증 전 편지 보내기
//     const posts: any[] = [];
//     for (let i = 0; i < 15; i++) {
//       const post = {
//         userId: 1,
//         name: '유찬', relationship: '친구', title: `test${i}`, contents: 'contents',
//         password: '0000', createdAt: new Date(), postAt: null, posted: false,
//       };
//       posts.push(post)
//     }

//     const newPosts: any[] = [];
//     for (let i = 0; i < 15; i++) {
//       const newPost = await postRepository.insert(posts[i]);
//       newPosts.push(newPost);
//     }

//     // 이후에 서버가 정상회 되었음
//     rokafClient.changeGetProfileReturnValue({
//       member: {
//         memberSeq: '12341234',
//         sodae: '1111',
//       },
//       serverOn: true,
//     });

//     // 작업 시작
//     await userService.retryGetProfile();

//     // 인증이 되어서 유저큐는 비어있어야 한다.
//     expect(await userQueue.size()).toBe(0);

//     for (let i = 0; i < 15; i++) {
//       const updated = await postRepository.findById(newPosts[i].id);
//       if (updated) {
//         if (i < 10) {
//           expect(updated.posted).toBe(true);
//         } else {
//           expect(updated.posted).toBe(false);
//         }
//       }

//     }
//     // const items = [
//     //   { id: 1, postId: 11, userId: 1 },
//     //   { id: 2, postId: 12, userId: 1 },
//     //   { id: 3, postId: 13, userId: 1 },
//     //   { id: 4, postId: 14, userId: 1 },
//     //   { id: 5, postId: 15, userId: 1 }
//     // ];
//     // expectpostQueue).toEqual(items);
//   });

//   test('테스트 이름', () => {
//     expect(1).toBe(1);
//     expect(1).toEqual(1);
//   });
// });