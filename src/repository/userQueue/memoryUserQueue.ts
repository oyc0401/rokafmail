interface queue {
  id; postId, userId;
}

export class MemoryUserQueue {
  userQueue: queue[];
  currentId;
  userRepository;

  constructor() {
    this.userQueue = []; // 데이터 저장을 위한 배열
    this.currentId = 1; // 간단한 ID 할당을 위한 변수
  }
  join(userRepository) {
    this.userRepository = userRepository;
  }

  async insert(data) {
    // 새 게시물에 ID를 할당하고 배열에 추가
    const newObj = { id: this.currentId++, ...data };
    this.userQueue.push(newObj);
    return newObj;
  }

  findAllWithUser = async () => {
    let result: any[] = [];
    for (let q of this.userQueue) {
      const user = await this.userRepository.findById(q.userId);
      result.push({ ...q, user: { ...user } });
    }
    return result;
  }

  deleteById = (id: number) => {
    return this.userQueue.splice(id - 1, 1);
  }
}
