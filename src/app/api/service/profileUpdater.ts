import Rokaf from "../rokaf/rokaf";
import { serveStatus, Status } from "src/lib/time";
import { User } from "src/db";

/**
 * 유저의 소대번호, 멤버번호를 업데이트하는 클래스
 */
export class ProfileUpdater {
  private userId: number;
  private name: string;
  private birth: string;
  private generation: number;
  private username: string;

  /**
   * id를 통해 DB에서 정보를 불러와 객체를 만든다.
   */
  static async dbInitialze(userId: number) {
    const user = await User.findById(userId);
    if (!user) throw Error('해당 유저를 찾을 수 없습니다.')
    const { name, birth, generation, username } = user;
    return new ProfileUpdater({ userId, name, birth, generation, username });
  }

  constructor({ userId, name, birth, generation, username }) {
    this.userId = userId;
    this.name = name
    this.birth = birth
    this.generation = generation
    this.username = username
  }

  /**
   * 유저의 정보를 불러와 업데이트하고 결과 enum을 반환한다.
   */
  async update() {
    const status = serveStatus(this.generation);

    if (status == Status.before || status == Status.beginning) {
      return updateStatus.before;
    }

    const result = await Rokaf.getProfile(this.name, this.birth);

    if (!result.serverOn) {
      return updateStatus.error;
    }

    if (result.member) {
      await User.update(this.userId, {
        memberSeq: result.member.memberSeq,
        sodae: result.member.sodae,
        connect: true,
      });
      return updateStatus.complete;
    }

    return updateStatus.fail;
  }

  getUsername(): string { return this.username }
  getGeneration(): number { return this.generation }
}

export enum updateStatus {
  before, complete, error, fail
}
