"use server";

import { repost, RepostStatus } from "src/app/api/retry/repostMailOnce";
import { Post, PostQueue, User } from "src/db";
import { makeLogger } from "config/winston";
const logger = makeLogger("Control Post");

// import {} from'src/app/api/retry/'

export async function enQueue(postId) {
  logger.info(`enqueue postId: ${postId}`)
  const post = await Post.findById(postId);
  if (post) {
   await PostQueue.insert({ postId, userId: post.userId });
    return true;
  }
  return false;
}
