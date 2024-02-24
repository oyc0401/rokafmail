"use server";

import { repost, RepostStatus } from "src/app/api/retry/repostMailOnce";
import { Post, User } from "src/db";
import { makeLogger } from "config/winston";
const logger = makeLogger("Resend Post");

// import {} from'src/app/api/retry/'

export async function resend(postId: number) {
  const post = await Post.findById(postId);
  if (!post) return;
  const user = await User.findById(post.userId);
  if (!user) return;

  const { name, relationship, title, contents, password, createdAt } = post;
  const { memberSeq, sodae, generation, username, id: userId } = user;
  if (!memberSeq || !sodae) return;

  const status = await repost({
    postId,
    post: { name, relationship, title, contents, password, createdAt },
    user: { memberSeq, sodae, generation },
  });

  const postLogForm = `${postId} - ${username} (${userId})`;
  let msg = "";

  switch (status) {
    case RepostStatus.success:
      msg = `success ${postLogForm}`;
      logger.info(msg);
      return msg;
    case RepostStatus.skip:
      msg = `skip ${postLogForm}`;
      logger.info(msg);
      return msg;
    case RepostStatus.after:
      msg = `after ${postLogForm}`;
      logger.info(msg);
      return msg;
    case RepostStatus.error:
      msg = `error ${postLogForm}`;
      logger.info(msg);
      return msg;
  }
}
