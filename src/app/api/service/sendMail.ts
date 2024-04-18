import Rokaf from "../rokaf/rokaf";
import { getNow, serveStatus, Status } from "src/lib/time";
import { Post } from "src/db";

export enum SendStatus {
  success,
  skip,
  after,
  error,
  fail,
}

export function sendStatusToStr(status: SendStatus) {
  switch (status) {
    case SendStatus.success:
      return `Complete`;
    case SendStatus.skip:
      return "QueueAdded - BeforeMailTime";
    case SendStatus.after:
      return `Skip - AfterMailTime`;
    case SendStatus.error:
      return `QueueAdded - ServerError`;
    case SendStatus.fail:
      return `QueueAdded - Fail`;
  }
}
/**
 * 해당 id의 편지를 보내고 보내졌다고 업데이트하고, 결과 enum 리턴하기
**/
export async function sendMail(postId: number): Promise<SendStatus> {

  const post = await Post.findById(postId);
  if (!post) throw Error('post is null');

  const { name, relationship, title, contents, password, createdAt } = post;
  const { memberSeq, sodae, generation } = post.user;

  const status = serveStatus(generation);
  // console.log(post)
  // console.log(user)

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
      return SendStatus.skip;
    case Status.training:
      if (!memberSeq || !sodae) throw Error('!memberSeq || !sodae');

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
      if (!postComplete.serverOn) return SendStatus.error;

      if (postComplete.complete) {
        await updatePost(postId);
        return SendStatus.success;
      } else {
        return SendStatus.fail;
      }

    case Status.ending:
    case Status.working:
    case Status.discharged:
      // 특학인편 하지말자 ~
      // 편지쓰기 기간 이후에 전송하면 보내졌다고 치기
      await updatePost(postId);
      return SendStatus.after;
  }
}

async function updatePost(postId) {
  await Post.update(postId, { posted: true, postAt: getNow() });;
}