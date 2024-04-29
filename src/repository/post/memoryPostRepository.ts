import prisma from "src/db/prisma";
import { PostRepository } from './postRepository';

export class MemoryPostRepository {
  posts;
  currentId;

  constructor() {
    this.posts = []; // 데이터 저장을 위한 배열
    this.currentId = 1; // 간단한 ID 할당을 위한 변수
  }

  async insert(post) {
    // 새 게시물에 ID를 할당하고 배열에 추가
    const newPost = { id: this.currentId++, ...post };
    this.posts.push(newPost);
    return newPost;
  }

  async findById(postId) {
    // ID로 게시물을 찾아 반환
    return this.posts.find(post => post.id === postId);
  }

  async update(postId, updatedPost) {
    // 해당 ID의 게시물을 찾아 정보 업데이트
    const postIndex = this.posts.findIndex(post => post.id === postId);
    if (postIndex !== -1) {
      this.posts[postIndex] = { ...this.posts[postIndex], ...updatedPost };
      return this.posts[postIndex];
    }
    return null; // 게시물이 없는 경우 null 반환
  }
}