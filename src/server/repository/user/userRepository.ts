export interface UserRepository {
  insert: (data: InputUser) => Promise<User>;
  findById: (userId: number) => Promise<User | null>;
  findByUsername: (username: string) => Promise<User | null>;
  updateRokafProfile: (userId: number, profile: RokafProfile) => Promise<User>;
  editProfile: (userId: number, editProps: EditProfileProps) => Promise<User>;
  editPassword: (userId: number, password: string) => Promise<void>;
  getAuthByUsername: (username: string) => Promise<UserJoinAuth | null>
}

export interface UserJoinAuth {
  id: number;
  username: string;
  name: string;
  auth: Auth | null;
}

export interface Auth {
  userId: number;
  provider: 'Credential' | 'Google' | null;
  password: string | null;
  uid: string | null;
}

export interface User {
  id: number;
  username: string;
  password: string;
  name: string;
  birth: string;
  generation: number;
  message: string;
  memberSeq: string | null;
  sodae: string | null;
  connect: boolean;
  createdAt: Date;
}

export interface InputUser {
  username: string;
  password: string;
  name: string;
  birth: string;
  generation: number;
  message: string;
}

export interface RokafProfile {
  memberSeq: string;
  sodae: string;
}

export interface EditProfileProps {
  name?: string;
  birth?: string;
  generation?: number;
  message?: string;
}