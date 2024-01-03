import { getProfile } from "./profile";
import { postMail } from "./postMail";

export default class Rokaf {
  static async getProfile(name, birth) {
    return getProfile(name, birth);
  }
  // body내부:
  // {
  //   senderName: post.name,
  //   relationship: post.relationship,
  //   title: post.title,
  //   contents: post.contents,
  //   password: post.password,
  //   sodaeVal: user.sodae,
  //   memberSeqVal: user.memberSeq
  // }
  static async postMail(body) {
    // console.time("Performance Time"); // 시작시간
    let complete = await postMail(body);
    // console.timeEnd("Performance Time");
    return complete;
  }
}
