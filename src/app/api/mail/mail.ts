"use server";
import { NextResponse } from "next/server";
import { getNow, serveStatus, Status } from "src/lib/time";
import Rokaf from "../rokaf/rokaf";
import { Post, PostQueue, UnconnectedPost, User } from "src/db";

import { ServerActionResponse } from ".././serverActionResponse";
import { makeLogger } from "config/winston";
const logger = makeLogger("mail");
import {
  repost,
  RepostStatus,
  statusToStr,
} from "src/app/api/retry/repostMailOnce";

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

type PostModel = {
  userId: number;
  postId: number;
  username: string;
  name: string;
  relationship: string;
  title: string;
  contents: string;
  password: string;
  memberSeq: string | null;
  sodae: string | null;
  generation: number;
  connect: boolean;
  createdAt: Date;
};

export async function mailApi(mailForm: {
  username: string;
  name: string;
  relationship: string;
  title: string;
  contents: string;
  password: string;
}) {
  try {
    const { username, name, relationship, title, contents, password } =
      mailForm;

    // 유저 확인
    const user = await User.findByUsername(username);

    if (!user) {
      return ServerActionResponse({
        message: "해당 유저를 찾을 수 없습니다.",
        status: 404,
      });
    }

    const { id: userId, memberSeq, sodae, connect, generation } = user;

    // 입력 검증
    const validationResult = validateInput(mailForm);
    if (!validationResult.validate) {
      return ServerActionResponse({
        message: validationResult.message,
        status: 400,
      });
    }

    // 편지 저장
    const { id: postId, createdAt } = await Post.insert({
      userId,
      name,
      relationship,
      title,
      contents,
      password,
    });

    // 연결되었으면 queue에 저장한다.
    if (connect) {
      await PostQueue.insert({ postId, userId });
      const postModel = {
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
        connect,
        createdAt,
      };

      // 큐에 저장된 메시지를 보낸다.
      processPost(postModel);
    } else {
      // 미확인 유저는 따로 저장한다.
      await UnconnectedPost.insert({ postId, userId });
      logger.info(
        `(${postId}) | ${username} (${userId}) | QueueAdded - Unconnected`,
      );
    }

    return ServerActionResponse({ message: "편지 전송 성공!", status: 200 });
  } catch (error) {
    logger.error(`편지 보내는 중 오류 발생: ${error}`);
    return ServerActionResponse({ message: "서버 오류", status: 500 });
  }
}

async function processPost(postModel: PostModel) {
  const { userId, postId, generation, username, connect } = postModel;
  const { name, relationship, title, contents, password } = postModel;
  const { memberSeq, sodae, createdAt } = postModel;

  let logMessage = "";

  if (!memberSeq || !sodae) {
    logMessage = "memberSeq or sodae is null";
  } else {
    const status = await repost({
      postId,
      post: { name, relationship, title, contents, password, createdAt },
      user: { memberSeq, sodae, generation },
    });
    logMessage = statusToStr(status);
  }

  logger.info(`(${postId}) | ${username} (${userId}) | ${logMessage}`);
}

function validateInput({
  username,
  name,
  relationship,
  title,
  contents,
  password,
}) {
  // 입력 검증
  if (password.length < 4) {
    return {
      message: "비밀번호는 4자리 이상이여야합니다.",
      validate: false,
    };
  }
  if (contents.length > 1200) {
    return {
      message: "내용은 1200자를 넘을 수 없습니다.",
      validate: false,
    };
  }
  if (title.length > 300) {
    return {
      message: "제목은 300자를 넘을 수 없습니다.",
      validate: false,
    };
  }
  if (name.length > 100) {
    return {
      message: "이름은 100자를 넘을 수 없습니다.",
      validate: false,
    };
  }
  if (relationship.length > 100) {
    return {
      message: "관계는 100자를 넘을 수 없습니다.",
      validate: false,
    };
  }

  return {
    message: "유효한 데이터 형식 입니다.",
    validate: true,
  };
}
