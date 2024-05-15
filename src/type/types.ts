import { Status, serveStatus } from "src/lib/time";

export class Profile {
  userId: number;
  name: string;
  birth: string;
  generation: number;
  username: string;
  constructor({ userId, name, birth, generation, username }) {
    this.userId = userId;
    this.name = name;
    this.birth = birth;
    this.generation = generation;
    this.username = username;
  }

  getStatus() {
    return serveStatus(this.generation);
  }
}


