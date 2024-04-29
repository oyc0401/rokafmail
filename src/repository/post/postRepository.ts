export interface PostWithUser {
  name: string; relationship: string;
  title: string; contents: string;
  password: string; createdAt: Date;
  posted: boolean; postAt: Date;
  user: {
    username: string;
    connect: boolean;
    generation: number;
    memberSeq: string | null;
    sodae: string | null;
  }
}

export interface PostRepository {
  findByIdWithUser: (id: number) => Promise<PostWithUser | null>;
  updatePostedTrue: (id: number) => Promise<void>;
}