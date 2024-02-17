"use server";

import { Post } from "src/db";
import { makeLogger } from "config/winston";
const logger = makeLogger("DeleteMail");

export async function deletePost(id, password) {
  const post = await Post.findById(id);
  console.log(id, password, post?.password);
  if (post && post.password == password) {
    await Post.deleteById(id);
    logger.info(
      `${id} 삭제! ${post.title} | ${post.contents} | ${post.name} | ${post.relationship} | ${post.password}`,
    );
    return true;
  }
  return false;
}
