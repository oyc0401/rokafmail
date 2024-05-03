export interface PostRepository {
  insert: (data: InsertPost) => Promise<Post>;
  findById: (id: number) => Promise<(Post & { user: Profile }) | null>;
  update: (id: number, data: UpdateType) => Promise<Post>;
  findNotPostedByUserId: (userId: number) => Promise<Post[]>;
}

interface Post {
  id: number; userId: number;
  name: string; relationship: string;
  title: string; contents: string;
  password: string; createdAt: Date;
  posted: boolean; postAt: Date | null;
  isPublic: boolean;
}

interface Profile {
  username: string;
  connect: boolean;
  generation: number;
  memberSeq: string | null;
  sodae: string | null;
}

interface InsertPost {
  userId: number;
  name: string;
  relationship: string;
  title: string;
  contents: string;
  password: string;
  isPublic: boolean;
}

interface UpdateType {
  name?: string; relationship?: string;
  title?: string; contents?: string;
  password?: string; posted?: boolean;
  postAt?: Date | null; isPublic?: boolean;
}

