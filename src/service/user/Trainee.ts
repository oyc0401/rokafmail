import { serveStatus } from "src/lib/time";

export class Trainee {
  username: string;
  password: string;
  name: string;
  birth: string;
  generation: number;
  message: string;
  memberSeq: string | null;
  sodae: string | null;

  constructor({ username, password, name, birth, generation, message,
    memberSeq, sodae }:
    {
      username: string,
      password: string,
      name: string,
      birth: string,
      generation: number,
      message: string,
      memberSeq?: string | null,
      sodae?: string | null,
    }
  ) {
    this.username = username;
    this.password = password;
    this.name = name;
    this.birth = birth;
    this.generation = generation;
    this.message = message;
    this.memberSeq = memberSeq ?? null;
    this.sodae = sodae ?? null;
  }

  currentStatus() {
    return serveStatus(this.generation);
  }
}