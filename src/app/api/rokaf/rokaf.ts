import { getProfile } from "./profile";
import { postMail } from "./postMail";
import { getSchoolProfile } from "./getSchoolProfile";
import { postSchoolMail } from "./postSchoolMail";

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
    return getSchoolProfile(name, birth, siteId);
  }

  static postSchoolMail(
    body: {
      name: string;
      relationship: string;
      title: string;
      contents: string;
      password: string;
      memberSeq: string;
    },
    createdAt = new Date(), siteId:string
  ) {
    return postSchoolMail(body, createdAt,siteId);
  }
}
