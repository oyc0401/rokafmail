"use server";
import { Post, PostQueue } from "src/db";
import { MailService } from "src/service/mail/MailService";
import { bean } from "src/bean/bean";
import { UserService } from "src/service/user/UserService";

export async function repost() {
  const mailservice = new MailService(bean);
  await mailservice.traversePostQueue();
}

export async function verify() {
  const userService = new UserService(bean);
  await userService.traverseUserQueue();
}

export async function findNotQueueNotpost() {

  //console.log(notPosted);
}

