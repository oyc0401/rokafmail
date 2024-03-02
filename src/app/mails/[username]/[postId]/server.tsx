"use server";

import { Post } from "src/db";
import { makeLogger } from "config/winston";
const logger = makeLogger("DeleteMail");

export async function deletePost(id: number, password: string) {
  const post = await Post.findById(id);
  if (post && post.password == password) {
    await Post.deleteById(id);
    logger.info(
      `${id} 삭제! ${post.title} | ${post.contents} | ${post.name} | ${post.relationship} | ${post.password}`,
    );
    return true;
  }
  return false;
}
