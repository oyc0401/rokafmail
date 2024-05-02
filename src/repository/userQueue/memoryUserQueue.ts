interface queue {
  id; postId, userId;
}

export class MemoryUserQueue {
  postQueue: queue[];
  currentId;
  postRepository;

  constructor() {
    this.postQueue = []; // 데이터 저장을 위한 배열
    this.currentId = 1; // 간단한 ID 할당을 위한 변수
  }
  join(postRepository) {
    this.postRepository = postRepository;
  }

  async insert(data) {
    // 새 게시물에 ID를 할당하고 배열에 추가
    const newObj = { id: this.currentId++, ...data };
    this.postQueue.push(newObj);
    return newObj;
  }

  findAll = async () => {
    let result: any[] = [];
    for (let q of this.postQueue) {
      const post = await this.postRepository.findById(q.postId);
      result.push({ ...q, post: { ...post } });
    }
    return result;
  }

  deleteById = (id: number) => {
    return this.postQueue.splice(id - 1, 1);
  }
}
