"use server";
import { verifyUser } from "src/app/api/retry/verifyUser";
import { repostMail } from "src/app/api/retry/repostMail";
import { Post, PostQueue } from "src/db";
import { sendPostQueues } from "src/app/api/retry/sendPostQueues";


export async function repost(){
 
  const unposted = await PostQueue.findAll();
   sendPostQueues(unposted,50);
 
}

export async function verify(){
  verifyUser();
}

export async function findNotQueueNotpost(){
  const queue = await PostQueue.findAll();
  const notPosted = await Post.notPosts();


  console.log(notPosted);
}