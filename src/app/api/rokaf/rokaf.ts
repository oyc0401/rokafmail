import { getProfile } from "./profile";
import { postMail } from "./postMail";
import { getuserProfile } from "./getGunsu1Profile";

export default class Rokaf {
  static getProfile(name: string, birth: string) {
    return getProfile(name, birth);
  }
  static postMail(
    body: {
      name: string;
      relationship: string;
      title: string;
      contents: string;
      password: string;
      memberSeq: string;
      sodae: string;
    },
    createdAt = new Date(),
  ) {
    return postMail(body, createdAt);
  }

  static getuserProfile(name: string, birth: string, siteId: string) {
    return getuserProfile(name, birth, siteId);
  }
}
