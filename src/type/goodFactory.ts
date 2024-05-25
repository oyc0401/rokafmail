import { Profile } from './types'

export class ProfileFactory {
  static create({ userId, name, birth, generation, username }): Profile {
    return new Profile({ userId, name, birth, generation, username });
  }

  static FromUser(user){
    const { generation, name, birth, id, username } = user;
     return new Profile({ userId: id, name, birth, generation, username });
  }
}