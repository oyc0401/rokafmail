export class MemoryUserRepository {
  users;
  currentId;
  postRepository;
  constructor() {
    this.users = []; // 데이터 저장을 위한 배열
    this.currentId = 1; // 간단한 ID 할당을 위한 변수

  }
  join(postRepository) {
    this.postRepository = postRepository;
  }

  async insert(data) {
    // 새 게시물에 ID를 할당하고 배열에 추가
    const newUser = { id: this.currentId++, ...data };
    this.users.push(newUser);
    return newUser;
  }

  async findById(userId) {
    // ID로 유저를 찾아 반환
    return this.users.find(user => user.id === userId);
  }

  async update(userId, updatedUser) {
    // 해당 ID의 유저를 찾아 정보 업데이트
    const userIndex = this.users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
      this.users[userIndex] = { ...this.users[userIndex], ...updatedUser };
      return this.users[userIndex];
    }
    return null; // 유저가 없는 경우 null 반환
  }

  findAll = () => this.users;

  deleteById = (id: number) => {
    return this.users.splice(id, 1);
  }
}
