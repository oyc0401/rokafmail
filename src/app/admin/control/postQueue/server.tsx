"use server";

//import { repost, RepostStatus } from "src/app/api/retry/repostMailOnce";
import { Post } from "src/db";
import { makeLogger } from "config/winston";
import { sendMail,SendStatus } from "src/app/api/service/sendMail";
const logger = makeLogger("Control Post Queue");

// import {} from'src/app/api/retry/'

export async function resend(postId: number) {

  const post = await Post.findById(postId)

  if (!post) return;

  const { name, relationship, title, contents, password, createdAt, userId } =
    post;
  const { memberSeq, sodae, generation, username } = post.user;
  if (!memberSeq || !sodae) return;

  const status = await sendMail(post.id);

  const postLogForm = `${postId} - ${username} (${userId})`;
  let msg = "";

  switch (status) {
    case SendStatus.success:
      msg = `success ${postLogForm}`;
      logger.info(msg);
      return msg;
    case SendStatus.skip:
      msg = `skip ${postLogForm}`;
      logger.info(msg);
      return msg;
    case SendStatus.after:
      msg = `after ${postLogForm}`;
      logger.info(msg);
      return msg;
    case SendStatus.error:
      msg = `error ${postLogForm}`;
      logger.info(msg);
      return msg;
    case SendStatus.fail:
      msg = `fail ${postLogForm}`;
      logger.info(msg);
      return msg;
  }
}
