import Rokaf from "../rokaf/rokaf";
import { getNow, serveStatus, Status } from "src/lib/time";
import { PostQueue, Post } from "src/db";

import { makeLogger } from "config/winston";
const logger = makeLogger("repostMail");

type Unpost = {
  postId: number;
  userId: number;
  user: {
    username: string;
    memberSeq: string | null;
    sodae: string | null;
    generation: number;
  };
  post: {
    id: number;
    userId: number;
    name: string;
    relationship: string;
    title: string;
    contents: string;
    password: string;
    createdAt: Date;
    posted: boolean;
    postAt: Date | null;
  };
};

export async function repostMail() {
  const unposted = await PostQueue.findAll();

  let i = 1;
  let length = unposted.length;

  logger.debug(`count: ${length}`);

  let success = 0;

  try {
    for (const unpost of unposted) {
      const message = await post(unpost);
      logger.debug(`${i}/${length}: ${message}`);
      i++;
      success++;
    }
  } catch (error) {
    logger.info(`${i}/${length}: ${error}`);
  }

  logger.info(`success: ${success}, notpost: ${length - success}`);
}

async function post(unpost: Unpost) {
  const { postId } = unpost;
  const { name, relationship, title, contents, password } = unpost.post;
  const { memberSeq, sodae, generation } = unpost.user;

  if (memberSeq == null || sodae == null) {
    logger.error(`memberSeq, sodae is null, repostMail Stopped.`);
    throw "memberSeq, sodae is null, repostMail Stopped.";
  }

  const status = serveStatus(generation);

  // 다시보내기 할 때 편지쓰기 가능한 시간에만 보낸다. 편지쓰기 이후에 보내도 일단은 그냥 postQueue에 두겠다. 훈련병이 안보내졌는지 확인하기 위해서??
  switch (status) {
    case Status.training:
      let postComplete = await Rokaf.postMail({
        name,
        relationship,
        title,
        contents,
        password,
        memberSeq,
        sodae,
      });
      // 국방서버에 보내는 요청
      if (postComplete.complete) {
        await relocatePost(postId);
        return "success";
      } else {
        throw "rokaf server error, repostMail Stopped";
      }
    case Status.before:
    case Status.beginning:
      return "before training";

    case Status.ending:
    case Status.working:
    case Status.discharged:
      // relocatePost()?? 할까말까 흠..
      return "after training";
  }
}

async function relocatePost(postId: number) {
  await Post.update(postId, { posted: true, postAt: getNow() });

  await PostQueue.deleteByPostId(postId);
}
