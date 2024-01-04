import { getProfile } from "./profile";
import { postMail } from "./postMail";

export default class Rokaf {
  static async getProfile(name: string, birth: string) {
    return getProfile(name, birth);
  }
  static async postMail(body: {
    name: string;
    relationship: string;
    title: string;
    contents: string;
    password: string;
    memberSeq: string;
    sodae: string;
  }) {
    return postMail(body);
  }
}
