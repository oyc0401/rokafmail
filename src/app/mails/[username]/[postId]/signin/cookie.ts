"use server";

import { cookies } from "next/headers";
import { Post } from "src/db";

export async function checkPassword(postId: number, password: string) {
  const post = await Post.findById(postId);
  if (!post) return false;


  const oriPw = post.password;
  const valid = oriPw == password;


  const decodeUsername = encodeURI(post.user.username);
  if (valid) {
    cookies().set({
      name: "password",
      value: password,
      path: `/mails/${decodeUsername}/${postId}`,
    });
  }

  return valid;
}
