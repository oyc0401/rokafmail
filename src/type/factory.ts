import { User } from "src/db";
import { Profile } from './types'

export class ProfileFactory {
  static create({ userId, name, birth, generation, username }): Profile {
    return new Profile({ userId, name, birth, generation, username });
  }

  static FromUser(user){
    const { generation, name, birth, id, username } = user;
     return new Profile({ userId: id, name, birth, generation, username });
  }

  /**
   * DB에서 해당 유저의 정보를 불러온다.
   */
  static async loadFromDB(userId: number): Promise<Profile> {
    const user = await User.findById(userId);
    if (!user) throw Error('해당 유저를 찾을 수 없습니다.')
    const { name, birth, generation, username } = user;
    return new Profile({ userId, name, birth, generation, username });
  }
}


/**
 * DB에서 해당 유저의 정보를 불러온다.
 * @deprecated
 */
export async function loadProfileFromDB(userId): Promise<Profile> {
  const user = await User.findById(userId);
  if (!user) throw Error('해당 유저를 찾을 수 없습니다.')
  const { name, birth, generation, username } = user;
  return new Profile({ userId, name, birth, generation, username });
}

/**
* @deprecated
*/
export function createProfile({ userId, name, birth, generation, username }) {
  return new Profile({ userId, name, birth, generation, username });
}