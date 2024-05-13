export interface PostQueue {
  insert: (postId: number) => Promise<PostQueueObject>;
  front: () => Promise<PostQueueObject>;
  pop: () => Promise<PostQueueObject>;
  empty: () => Promise<boolean>;
  size: () => Promise<number>;
}

export interface PostQueueObject {
  id: number;
  postId: number;
  createdAt: Date;
}