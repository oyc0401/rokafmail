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

export function statusToStr(status: RepostStatus) {
  switch (status) {
    case RepostStatus.success:
      return `Complete`;
    case RepostStatus.skip:
      return "QueueAdded - BeforeMailTime";
    case RepostStatus.after:
      return `Skip - AfterMailTime`;
    case RepostStatus.error:
      return `QueueAdded - ServerError`;
    case RepostStatus.fail:
      return `QueueAdded - Fail`;
  }
}
/**
 * postId, post, user가 주어지면 편지를 보내고, 보내지면 postQueue에 있는 post를 삭제한다.

**/
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
  console.log(post)
  console.log(user)

  // 다시보내기 할 때 편지쓰기 가능한 기간에만 보낸다.
  // 편지쓰기 이후에 보내도 일단은 그냥 스킵하고 postQueue에 그대로 두겠다.
  // 나중에 있을 특학 편지를 위해서

  switch (status) {
      // 원래 소대번호가 발견이 되야 큐에 넣어지고 이 함수를 쓸 수 있는데
      // 스킵이 될 수가 없는데 일단 넣어놓음
      // 스킵뜨면 오류처리하셈
      // 스킵이 뜨려면 미래의 기수로 해놓고 소대번호가 발견이 되어야함.
      // 그럼 해당 사람이 아니라는건데
      // 오류가 맞지
      // 정상적으로 화원가입 하고 이후에 기수를 바꾸면 여기 와지겠네
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
      if (!postComplete.serverOn) return RepostStatus.error;

      if (postComplete.complete) {
        await relocatePost(postId);
        return RepostStatus.success;
      } else {
        return RepostStatus.fail;
      }

    case Status.ending:
    case Status.working:
    case Status.discharged:
      // 특학인편 하지말자 ~
      await relocatePost(postId);
      return RepostStatus.after;
  }
}

async function relocatePost(postId: number) {
  await Post.update(postId, { posted: true, postAt: getNow() });
  await PostQueue.deleteByPostId(postId);
}
