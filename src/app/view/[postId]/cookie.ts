"use server";

import { cookies } from "next/headers";
import { Post } from "src/db";

export async function setCookie(password: string, postId:number) {
  cookies().set({
    name: "password",
    value: password,
    path: `/view/${postId}`,
  });
}

export async function deleteCookie() {
  cookies().delete("password");
}

export async function checkPassword(postId:number, password:string) {
  const post = await Post.findById(postId);
  if (!post) {
    return false;
  }

  const oriPw = post.password;
  const valid = oriPw == password;

  if(valid){
    setCookie(password, postId);
  }
  return valid;
}
