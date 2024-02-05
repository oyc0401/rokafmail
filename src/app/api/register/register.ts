"use server";
import { NextResponse } from "next/server";
import Rokaf from "../rokaf/rokaf";
import { serveStatus, Status } from "src/lib/time";
import { UserQueue, User } from "src/db";

// 로그인을 하면 먼저 DB에 저장한다.
// 편지쓰기 가능한 기간이면 국방부 사이트에서 존재하는지 확인하고, 아니면 그냥 둔다.
// 존재하는 유저면 connect를 true로 업데이트한다.
// 존재하지 않으면 users_queue에 추가한다.

import { makeLogger } from "config/winston";
import { duplicateUsername, validB, validG } from "./valid";
const logger = makeLogger("register");

export async function registerApi({
  username,
  password,
  name,
  birth,
  generation,
  message,
}) {
  console.log("회원가입 중...");

  // 인터넷 편지 사이트 프로필 가져오기

  if (!validG(generation).valid) {
    return { message: validG(generation).text, status: 400 };
  }
  if (!validB(birth).valid) {
    return { message: validB(birth).text, status: 400 };
  }

  if (await duplicateUsername(username)) {
    return { message: "아이디가 중복되었습니다.", status: 400 };
  }
  if (password.length < 4) {
    return { message: "비밀번호는 4자리 이상이여야합니다.", status: 400 };
  }

  if (name.length > 100) {
    return { message: "이름은 100자 이하여야합니다.", status: 400 };
  }

  if (message.length > 500) {
    return { message: "메시지는 500자 이하여야합니다.", status: 400 };
  }

  // 유저 만들기
  const newUser = await User.insert({
    username,
    password,
    name,
    birth,
    generation,
    message,
  });

  const id = newUser.id;

  checkUser({ id, name, birth, generation, username });

  return { message: "회원가입 성공", status: 200 };
}

async function checkUser({ id, name, birth, generation, username }) {
  const status = serveStatus(generation);

  // 전역 후에도 회원가입은 가능하다. 다만 편지를 못쓸뿐
  switch (status) {
    case Status.before:
    case Status.beginning:
      await insertQueue(id);
      logger.info(
        `${username} (${id}) ${name}, ${birth}, ${generation} | user queue`,
      );
      break;
    case Status.training:
    case Status.ending:
    case Status.working:
    case Status.discharged:
      await saveUser(id, name, birth, generation, username);

      break;
  }

  return;
}

async function insertQueue(userId: number) {
  await UserQueue.insert({ userId });
}

async function saveUser(
  userId: number,
  name: string,
  birth: string,
  generation: number,
  username: string,
) {
  console.log("편지쓰기 이후 유저, 번호 찾기 시작.");

  // 유저가 존재하는지 확인
  const { member } = await Rokaf.getProfile(name, birth);

  // 유저인증이 안되면 인증 테이블에 저장
  if (member != null) {
    console.log(
      `유저 인증 성공 memberSeq:${member.memberSeq}, sodae:${member.sodae}`,
    );
    console.log("정보 업데이트 중...");
    await User.update(userId, {
      memberSeq: member.memberSeq,
      sodae: member.sodae,
      connect: true,
    });
    logger.info(
      `${username} (${userId}) ${name}, ${birth}, ${generation} | complete - user`,
    );
  } else {
    console.log("유저 인증 실패, 인증 큐에 저장하는 중...");
    await insertQueue(userId);
    logger.info(
      `${username} (${userId}) ${name} ${birth} ${generation} | false - user queue`,
    );
  }
}
