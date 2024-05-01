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

  findAll = () => this.users;

  deleteById = (id: number) => {
    return this.users.splice(id, 1);
  }
}
