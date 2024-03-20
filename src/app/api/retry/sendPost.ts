import Rokaf from "../rokaf/rokaf";
import { getNow, serveStatus, serveStatusVer2, Status } from "src/lib/time";
import { PostQueue, Post } from "src/db";
import { makeLogger } from "config/winston";
const logger = makeLogger("Send");

interface SendResponse {
  level: string;
  message: string;
  complete: boolean;
}

/**
 * postId, post, user가 주어지면 편지를 보내고, 보내지면 postQueue에 있는 post를 삭제한다.
 **/
export async function sendPost({ queueId }): Promise<SendResponse> {
  const post = await PostQueue.findById(queueId);
  if (!post) {
    throw Error(`PostQueue에 id: ${queueId} 인 요소가 없습니다.`);
  }

  const postId = post.postId;
  const {
    name,
    relationship,
    title,
    contents,
    password,
    createdAt,
    특학memberSeq,
    siteId,
  } = post.post;
  const { memberSeq, sodae, generation, graduateDate } = post.user;

  async function postMail() {
    // if memberSeq or sodae is null, user dosen't enter airforce
    if (!memberSeq || !sodae) {
      return {
        complete: true,
        level: "warn",
        message: `Not Found: memberSeq or sodae is null`,
      };
    }

    let response = await Rokaf.postMail(
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
    if (!response.serverOn)
      return { complete: false, level: "info", message: `Server Error` };

    if (response.complete) {
      await relocatePost(postId);
      return { complete: true, level: "info", message: `Complete` };
    } else {
      return { complete: true, level: "warn", message: `QueueAdded - Fail` };
    }
  }

  async function postSchoolMail() {
    // if memberSeq or sodae is null, user dosen't enter airforce
    if (!특학memberSeq || !siteId) {
      return {
        complete: true,
        level: "info",
        message: `Wait School Information`,
      };
    }

    let response = await Rokaf.postSchoolMail(
      {
        name,
        relationship,
        title,
        contents,
        password,
        특학memberSeq,
      },
      createdAt,
      siteId,
    );

    // 특학에 보내기
    if (!response.serverOn)
      return {
        complete: false,
        level: "info",
        message: `School Server Error`,
      };

    if (response.complete) {
      await relocatePost(postId);
      return { complete: true, level: "info", message: `School Complete` };
    } else {
      return {
        complete: true,
        level: "warn",
        message: `QueueAdded - School Fail`,
      };
    }
  }

  const status = serveStatusVer2(generation, graduateDate);

  switch (status) {
    // 소대번호가 있으면 보내는 시간 전에 보내도 되지 않을까?
    case Status.before:
    case Status.beginning:

    case Status.training:
      return await postMail();

    case Status.ending:
    case Status.school:
      return await postSchoolMail();

    case Status.working:
    case Status.discharged:
      await relocatePost(postId);
      return { complete: true, level: "info", message: `End - Dequeue Post` };
  }
}

async function relocatePost(postId: number) {
  await Post.update(postId, { posted: true, postAt: getNow() });
  await PostQueue.deleteByPostId(postId);
}
