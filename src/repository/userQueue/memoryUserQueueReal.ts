import { UserQueue, UserQueueObject } from "./userQueue";

export class MemoryUserQueue implements UserQueue {
  private queue: UserQueueObject[];
  private nextId: number;

  constructor() {
    this.queue = [];
    this.nextId = 1;
  }

  async insert(userId: number): Promise<UserQueueObject> {
    const newUserQueueObject: UserQueueObject = {
      id: this.nextId++,
      userId,
      createdAt: new Date()
    };
    this.queue.push(newUserQueueObject);
    return newUserQueueObject;
  }

  async front(): Promise<UserQueueObject> {
    if (this.queue.length === 0) {
      throw new Error('Queue is empty');
    }
    return this.queue[0];
  }

  async pop(): Promise<UserQueueObject> {
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