"use server";
import { verifyUser } from "src/app/api/retry/verifyUser";
import { sendAllMails } from "src/app/api/retry/mailQueue";
import { Post, PostQueue } from "src/db";

export async function repost() {
  sendAllMails();
}

export async function verify() {
  verifyUser();
}

export async function findNotQueueNotpost() {
  const queue = await PostQueue.findAll();
  const notPosted = await Post.notPosts();


  //console.log(notPosted);
}

