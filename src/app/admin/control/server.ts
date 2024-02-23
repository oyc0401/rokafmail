"use server";
import { verifyUser } from "src/app/api/retry/verifyUser";
import { repostMail } from "src/app/api/retry/repostMail";


export async function repost(){
  repostMail();
}

export async function verify(){
  verifyUser();
}