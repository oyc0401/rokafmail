import { User } from "src/db";
import { Profile } from './types'
/**
 * DB에서 해당 유저의 정보를 불러온다.
 */
export async function loadProfileFromDB(userId): Promise<Profile> {
  const user = await User.findById(userId);
  if (!user) throw Error('해당 유저를 찾을 수 없습니다.')
  const { name, birth, generation, username } = user;
  return createProfile({ userId, name, birth, generation, username });
}

export function createProfile({ userId, name, birth, generation, username }) {
  return { userId, name, birth, generation, username }
}