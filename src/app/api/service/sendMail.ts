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
 * 주의사항:
 * 해당 id를 가진 Post가 DB에 있어야합니다.
 * 편지가능 기간 이전에 해당 함수를 호출하면 안됩니다.
 * 에러 다수 던짐
**/
export async function sendMail(postId: number): Promise<SendStatus> {

  const post = await Post.findById(postId);
  if (!post) throw Error(`id가 ${postId}인 편지를 찾을 수 없습니다.`);

  const { name, relationship, title, contents, password, createdAt } = post;
  const { memberSeq, sodae, generation } = post.user;

  const status = serveStatus(generation);

  switch (status) {
    case Status.before:
    case Status.beginning:
      throw Error(`현재 ${generation}기는 편지를 보낼 수 없습니다.`)
    case Status.training:
      if (!memberSeq || !sodae) throw Error('memberSeq 또는 sodae가 null입니다.');

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