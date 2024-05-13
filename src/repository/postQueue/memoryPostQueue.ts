import { PostQueue, PostQueueObject } from "./postQueue";

export class MemoryPostQueue implements PostQueue {
  private queue: PostQueueObject[];
  private nextId: number;

  constructor() {
    this.queue = [];
    this.nextId = 1;
  }

  async insert(postId: number): Promise<PostQueueObject> {
    const newPostQueueObject: PostQueueObject = {
      id: this.nextId++,
      postId,
      createdAt: new Date()
    };
    this.queue.push(newPostQueueObject);
    return newPostQueueObject;
  }

  async front(): Promise<PostQueueObject> {
    if (this.queue.length === 0) {
      throw new Error('Queue is empty');
    }
    return this.queue[0];
  }

  async pop(): Promise<PostQueueObject> {
    if (this.queue.length === 0) {
      throw new Error('Queue is empty');
    }
    return this.queue.shift()!;
  }

  async empty() {
    return this.queue.length === 0;
  }

  async size() {
    return this.queue.length;
  }
}