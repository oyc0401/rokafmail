import Rokaf from "../rokaf/rokaf";
import { getNow } from "src/lib/time";
import { PostQueue, Post } from "src/db";

export async function repostMail() {
  console.log("repostMail...");

  const unposted = await PostQueue.findAll();

  console.log("repost: 편지 보내기 시작, 미발송 편지 수:", unposted.length);

  for (const post of unposted) {
    console.log(post);
    const { postId } = post;
    const { name, relationship, title, contents, password } = post.post;
    const { username, memberSeq, sodae } = post.user;
    if (memberSeq == null || sodae == null) {
      console.log("왜 여기에 null이 있는거야");
      return;
    }

    let postComplete = await Rokaf.postMail({
      name,
      relationship,
      title,
      contents,
      password,
      memberSeq,
      sodae,
    });
    // 국방서버에 보내는 요청
    if (postComplete.complete) {
      console.log("성공!!", postId, username);
      await Post.update(postId, { posted: true, postAt: getNow() });
      await PostQueue.deleteByPostId(postId);
    } else {
      console.log("실패ㅜ");
      console.log("repostMail Stopped!");
      return;
    }
  }

  console.log("repostMail Complete!");
}
