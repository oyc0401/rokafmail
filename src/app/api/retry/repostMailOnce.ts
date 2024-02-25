import Rokaf from "../rokaf/rokaf";
import { getNow, serveStatus, Status } from "src/lib/time";
import { PostQueue, Post } from "src/db";
import { makeLogger } from "config/winston";

export enum RepostStatus {
  success,
  skip,
  after,
  error,
  fail,
}

export async function repost({
  postId,
  post,
  user,
}: {
  postId: number;
  post: {
    name: string;
    relationship: string;
    title: string;
    contents: string;
    password: string;
    createdAt: Date;
  };
  user: {
    memberSeq: string;
    sodae: string;
    generation: number;
  };
}) {
  const { name, relationship, title, contents, password, createdAt } = post;
  const { memberSeq, sodae, generation } = user;

  const status = serveStatus(generation);

  // 다시보내기 할 때 편지쓰기 가능한 기간에만 보낸다.
  // 편지쓰기 이후에 보내도 일단은 그냥 스킵하고 postQueue에 그대로 두겠다.
  // 편지가 안 보내졌다는걸 확실히 알려주기 위해서

  switch (status) {
    case Status.before:
    case Status.beginning:
      return RepostStatus.skip;

    case Status.training:
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
      if (postComplete.serverOn) {
        return RepostStatus.error;
      }
      if (postComplete.complete) {
        await relocatePost(postId);
        return RepostStatus.success;
      } else {
        return RepostStatus.fail;
      }

    case Status.ending:
    case Status.working:
    case Status.discharged:
      // relocatePost() 할까말까 흠..
      return RepostStatus.after;
  }
}

async function relocatePost(postId: number) {
  await Post.update(postId, { posted: true, postAt: getNow() });

  await PostQueue.deleteByPostId(postId);
}
