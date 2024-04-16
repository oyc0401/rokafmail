"use server";
import { verifyUser } from "src/app/api/retry/verifyUser";
import { repostMail } from "src/app/api/retry/repostMail";
import { Post, PostQueue } from "src/db";
import { asyncPost } from "src/app/api/service/asyncPost";


export async function repost() {

  const queue = await PostQueue.findAll();
  for (const post of queue) {
    await asyncPost(post.id);
  }
}

export async function verify() {
  verifyUser();
}

export async function findNotQueueNotpost() {
  const queue = await PostQueue.findAll();
  const notPosted = await Post.notPosts();


  //console.log(notPosted);
}

