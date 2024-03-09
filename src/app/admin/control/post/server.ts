"use server";

import { repost, RepostStatus } from "src/app/api/retry/repostMailOnce";
import { Post, PostQueue, User } from "src/db";
import { makeLogger } from "config/winston";
import Rokaf from "src/app/api/rokaf/rokaf";
const logger = makeLogger("Control Post");

// import {} from'src/app/api/retry/'

export async function enQueue(postId) {
  logger.info(`enqueue postId: ${postId}`);
  const post = await Post.findById(postId);
  if (post) {
    await PostQueue.insert({ postId, userId: post.userId });
    return true;
  }
  return false;
}

export async function forcePost(postId) {
  logger.info(`forcePost: ${postId}`);
  const post = await Post.findById(postId);

  if (post) {
    const { name, relationship, title, contents, password, createdAt } = post;
    const { memberSeq, sodae } = post.user;
    let postComplete = await Rokaf.postMail(
      {
        name,
        relationship,
        title,
        contents,
        password,
        memberSeq,
        sodae,
      },
      createdAt,
    );
    // 국방서버에 보내는 요청
    if (!postComplete.serverOn) {
      return "RepostStatus.error";
      // return RepostStatus.error;
    }
    if (postComplete.complete) {
      return "RepostStatus.success";
      // return RepostStatus.success;
    } else {
      return "RepostStatus.fail";
      // return RepostStatus.fail;
    }
  }
  return "notfound";
}
