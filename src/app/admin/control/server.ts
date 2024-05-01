"use server";
import { verifyUser } from "src/app/api/retry/verifyUser";
import { Post, PostQueue } from "src/db";
import { MailService } from "src/service/mail/MailService";
import { bean } from "src/bean/bean";

export async function repost() {
  const mailservice = new MailService(bean);
  await mailservice.traversePostQueue();
}

export async function verify() {
  verifyUser();
}

export async function findNotQueueNotpost() {
  const queue = await PostQueue.findAll();
  const notPosted = await Post.notPosts();


  //console.log(notPosted);
}

