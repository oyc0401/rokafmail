import Rokaf from "../rokaf/rokaf";
import { getNow } from "src/lib/time";
import { PostQueue, Post } from "src/db";

type Unpost = {
  postId: number;
  userId: number;
  user: {
    username: string;
    memberSeq: string | null;
    sodae: string | null;
  };
  post: {
    id: number;
    userId: number;
    name: string;
    relationship: string;
    title: string;
    contents: string;
    password: string;
    createdAt: Date;
    posted: boolean;
    postAt: Date | null;
  };
};

export async function repostMail() {
  console.log("repostMail...");

  const unposted = await PostQueue.findAll();

  console.log("repostMail: 편지 보내기 시작, 미발송 편지 수:", unposted.length);

  post(unposted).then(() => console.log("repostMail Complete!"));
}

async function post(unposted: Unpost[]) {
  for (const post of unposted) {
    const { postId } = post;
    const { name, relationship, title, contents, password } = post.post;
    const { username, memberSeq, sodae } = post.user;

    if (memberSeq == null || sodae == null) {
      return console.log("Danger: 왜 여기에 null이 있는거야");
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
      await relocatePost(postId);
    } else {
      console.log("repostMail Stopped!");
      return;
    }
  }
}

async function relocatePost(postId: number) {
  await Post.update(postId, { posted: true, postAt: getNow() });
  
  await PostQueue.deleteByPostId(postId);
}
