"use server";
import { NextResponse } from "next/server";
import { getNow, serveStatus, Status } from "src/lib/time";
import Rokaf from "../rokaf/rokaf";
import { Post, PostQueue, UnconnectedPost, User } from "src/db";

import { ServerActionResponse } from ".././serverActionResponse";
// 편지를 보내면 먼저 post에 저장한다.
// 인증안된 유저면 unconnected에 추가
// 인증된 유저는
// 편지쓰기 가능한 기간이면 보내고 아니면 그냥 둔다.
// 보내지면 posted를 true로 업데이트한다.
// 안보내지면 post_queue에 추가한다.
import { makeLogger } from "config/winston";
const logger = makeLogger("mail");

/**
 * 유저 확인: 제공된 username을 사용하여 유저가 존재하는지 확인합니다.
 * 입력 검증: 비밀번호, 내용, 제목, 이름, 관계의 길이를 검증합니다.
 * 편지 저장: 유효한 입력에 대해 편지 정보를 Post 테이블에 저장합니다.
 * 인증 여부 확인: 유저의 인증 상태(connect)를 확인합니다.
 * 인증되지 않은 유저: 인증되지 않은 경우, 정보를 UnconnectedPost 테이블에 저장합니다.
 * 인증된 유저 & 편지 전송 시간 확인: 인증된 유저의 경우, 편지를 보낼 수 있는 시간(serveStatus)을 확인합니다.
 * 국방부 서버로 편지 전송: 편지 보내기 기간(Status.training)이면 국방부 서버로 편지를 전송합니다.
 * 편지 전송 상태 업데이트: 국방부 서버로 편지 전송이 성공하면, Post 테이블의 posted 상태를 true로 업데이트합니다.
 * 편지 큐 저장: 국방부 서버로 전송하기에 적합한 시간이 아니면, PostQueue에 편지 정보를 저장합니다.
 */

export async function mailApi({
  username,
  name,
  relationship,
  title,
  contents,
  password,
}: {
  username: string;
  name: string;
  relationship: string;
  title: string;
  contents: string;
  password: string;
}) {
  // 유저 확인
  const user = await User.findByUsername(username).catch((error) => {
    throw ServerActionResponse({ message: error, status: 500 });
  });

  if (!user) {
    return ServerActionResponse({
      message: "해당 유저를 찾을 수 없습니다.",
      status: 404,
    });
  }

  const { id: userId, memberSeq, sodae, connect, generation } = user;

  // 입력 검증
  if (password.length < 4) {
    return ServerActionResponse({
      message: "비밀번호는 4자리 이상이여야합니다.",
      status: 400,
    });
  }
  if (contents.length > 1200) {
    return ServerActionResponse({
      message: "내용은 1200자를 넘을 수 없습니다.",
      status: 400,
    });
  }
  if (title.length > 300) {
    return ServerActionResponse({
      message: "제목은 300자를 넘을 수 없습니다.",
      status: 400,
    });
  }
  if (name.length > 100) {
    return ServerActionResponse({
      message: "이름은 100자를 넘을 수 없습니다.",
      status: 400,
    });
  }
  if (relationship.length > 100) {
    return ServerActionResponse({
      message: "관계는 100자를 넘을 수 없습니다.",
      status: 400,
    });
  }

  // 편지 저장
  const newPost = await Post.insert({
    userId,
    name,
    relationship,
    title,
    contents,
    password,
  }).catch(e, () => {
    return ServerActionResponse({ message: "데이터베이스 오류", status: 500 });
  });

  const postId = newPost.id;
  console.log("post 업로드 성공.");

  // 인증 여부 확인
  if (!connect) {
    UnconnectedPost.insert({
      postId,
      userId,
    }).then(() => {
      const msg = "unconnected_post";
      logger.info(
        `${username} (${userId}), ${msg} (${postId}) | [${name}, ${relationship}, ${title}, ${contents}. ${password}]`,
      );
    });
  } else {
    sendMail({
      userId,
      postId,
      username,
      name,
      relationship,
      title,
      contents,
      password,
      memberSeq,
      sodae,
      generation,
    });
  }
  return ServerActionResponse({ message: "편지 전송 성공!", status: 200 });
}

async function sendMail({
  userId,
  postId,
  username,
  name,
  relationship,
  title,
  contents,
  password,
  memberSeq,
  sodae,
  generation,
}) {
  // 만약 편지보내기 기간이 아직 안왔으면 안보내고 post_queue에만 저장하고
  // 편지보내기 시간이 지났으면 posted를 true로 업데이트 하되, 국방부 서버에는 보내지 말기

  // 인증된 유저면 국방부에 보내보기

  const status = serveStatus(generation);

  // 국방부 서버 보내는건 편지쓰기 기간에만 가능, 어짜피 다른시간에 보내도 도착안함
  switch (status) {
    case Status.training:
      console.log("국방부 서버 보내는 중...");
      const response = await Rokaf.postMail({
        name,
        relationship,
        title,
        contents,
        password,
        memberSeq,
        sodae,
      });

      // 국방서버에 보내졌으면 보내졌다고 업데이트
      if (response.complete) {
        await Post.update(postId, { posted: true, postAt: getNow() });
        const msg = "complete";
        logger.info(
          `${username} (${userId}), ${msg} (${postId}) | [${name}, ${relationship}, ${title}, ${contents}. ${password}]`,
        );
      } else {
        // 안보내졌으면 편지큐에 저장
        await PostQueue.insert({ postId, userId });
        const msg = "server error";
        logger.info(
          `${username} (${userId}), ${msg} (${postId}) | [${name}, ${relationship}, ${title}, ${contents}. ${password}]`,
        );
      }
      break;

    case Status.before:
    case Status.beginning:
      // 안보내졌으면 편지큐에 저장
      await PostQueue.insert({ postId, userId });
      // 소대번호 다 있는데 편지쓰기 시간 전이면 안되지
      const msg =
        "소대번호 다 있는데 편지쓰기 시간 전에 편지가 보내져? PostQueue에 넣음.";
      logger.error(
        `${username} (${userId}), ${msg} (${postId}) | [${name}, ${relationship}, ${title}, ${contents}. ${password}]`,
      );
      break;

    case Status.ending:
    case Status.working:
    case Status.discharged:
      await Post.update(postId, { posted: true, postAt: getNow() });

      const msg2 = "after";
      logger.info(
        `${username} (${userId}), ${msg2} (${postId}) | [${name}, ${relationship}, ${title}, ${contents}. ${password}]`,
      );
      break;
  }

  console.log(`${username} 편지 전송 완료!`);
}
