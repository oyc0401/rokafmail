
import { Auth, EditProfileProps, InputAuth, InputUser, RokafProfile, User, UserRepository } from "./userRepository";

export class MemoryUserRepository implements UserRepository {
  users: User[];
  auths: Auth[];
  currentId: number;

  constructor() {
    this.users = []; // 데이터 저장을 위한 배열
    this.auths = []; // 데이터 저장을 위한 배열
    this.currentId = 1; // 간단한 ID 할당을 위한 변수
  }

  async insert(data: InputUser) {
    // 새 게시물에 ID를 할당하고 배열에 추가
    const newUser: User = {
      id: this.currentId++,
      createdAt: new Date(),
      connect: false,
      sodae: null,
      memberSeq: null,
      ...data
    };
    this.users.push(newUser);

    return newUser;
  }

  createAuth = async (data: InputAuth) => {
    const newAuth = {
      userId: data.userId,
      provider: data.provider,
      password: data.password,
      uid: data.uid
    };

    this.auths.push(newAuth);

    return newAuth;
  };


  async findById(userId: number) {
    // ID로 유저를 찾아 반환
    const user = this.users.find(user => user.id === userId);
    return user || null;
  }

  async findByUsername(username: string) {
    // username으로 유저를 찾아 반환
    const user = this.users.find(user => user.username === username);
    return user || null;
  }

  async updateRokafProfile(userId: number, profile: RokafProfile) {
    // 해당 ID의 유저를 찾아 정보 업데이트
    const userIndex = this.users.findIndex(user => user.id == userId);
    if (userIndex == -1) {
      throw new Error('해당 유저가 없습니다.')
    }
    this.users[userIndex] = {
      ...this.users[userIndex],
      connect: true,
      sodae: profile.sodae,
      memberSeq: profile.memberSeq
    };
    return this.users[userIndex];
  }

  async editProfile(userId: number, editProps: EditProfileProps) {
    // 유저 ID를 찾아 프로필 정보를 수정
    const userIndex = this.users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      throw new Error('해당 유저가 없습니다.');
    }
    this.users[userIndex] = {
      ...this.users[userIndex],
      ...editProps
    };
    return this.users[userIndex];
  }

  async editPassword(userId: number, password: string) {
    // 유저 ID를 찾아 비밀번호를 수정
    const authIndex = this.auths.findIndex(auth => auth.userId === userId);
    if (authIndex !== -1) {
      this.auths[authIndex].password = password;
    } else {
      throw new Error('해당 유저의 인증정보가 없습니다.');
    }
  }

  async getAuthByUsername(username: string) {
    // username으로 Auth 정보를 찾아 반환
    const user = await this.findByUsername(username);
    if (!user) return null;

    const auth = this.auths.find(auth => auth.userId === user.id);
    if (!auth) return null;

    const userJoinAuth = {
      id: user.id,
      username: user.username,
      name: user.name,
      auth: auth,
    };
    return userJoinAuth;
  }

}
