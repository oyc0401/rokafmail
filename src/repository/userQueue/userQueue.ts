export interface UserQueue {
  insert: (userId: number) => Promise<UserQueueObject>;
  front: () => Promise<UserQueueObject>;
  pop: () => Promise<UserQueueObject>;
  empty: () => Promise<boolean>;
  size: () => Promise<number>;
}

export interface UserQueueObject {
  id: number;
  userId: number;
  createdAt: Date;
}