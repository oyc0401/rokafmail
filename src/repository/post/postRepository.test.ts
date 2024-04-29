import { describe, expect, test } from '@jest/globals';
import { MemoryPostRepository } from 'src/repository/post/memoryPostRepository';

describe('Repository Test', () => {

  test('PostRepository 삽입', async () => {
    let memoryPostRepository = new MemoryPostRepository();
    const dummy = {
      name: '하이',
      content: '내용',
    };
    const newPost = await memoryPostRepository.insert(dummy);

    const post = await memoryPostRepository.findById(newPost.id);

    expect(post).toBe(newPost);
  });

  test('PostRepository 업데이트', async () => {
    let memoryPostRepository = new MemoryPostRepository();
    const originalPost = {
      name: '하이',
      content: '내용',
    };

    const newPost = await memoryPostRepository.insert(originalPost);
    await memoryPostRepository.update(newPost.id, { name: '호랑이' });

    const updatedPost = await memoryPostRepository.findById(newPost.id);

    // updatedPost 객체가 기대하는 속성 값을 가지고 있는지 확인
    expect(updatedPost).toEqual({
      ...newPost,
      name: '호랑이'
    });
  });

  test('테스트 이름', () => {
    expect(1).toBe(1);
  });
})
