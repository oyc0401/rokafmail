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

  let i = 1;
  let length = unposted.length;

  console.log("repostMail count:", unposted.length);
  try {
    for (const unpost of unposted) {
      const message = await post(unpost);
      console.log(`repostMail ${i}/${length}:`, message);
      i++;
    }
  } catch (error) {
    console.log(`repostMail ${i}/${length}:`, error);
    return;
  }

  console.log("repostMail Complete!");
}

async function post(unpost: Unpost) {
  const { postId } = unpost;
  const { name, relationship, title, contents, password } = unpost.post;
  const { memberSeq, sodae } = unpost.user;

  if (memberSeq == null || sodae == null) {
    throw "memberSeq, sodae is null, repostMail Stopped.";
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
    return "success";
  } else {
    throw "rokaf server error, repostMail Stopped";
  }
}

async function relocatePost(postId: number) {
  await Post.update(postId, { posted: true, postAt: getNow() });

  await PostQueue.deleteByPostId(postId);
}
