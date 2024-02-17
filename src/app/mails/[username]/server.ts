"use server";

import { Post } from "src/db";

export async function deletePost(id, password) {
 
  const post = await Post.findById(id);
   console.log(id,password,post?.password)
  if (post && post.password == password) {
    await Post.deleteById(id);
    return true;
  }
  return false;
}
