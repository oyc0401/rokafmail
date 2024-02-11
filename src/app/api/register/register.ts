"use server";
import { NextResponse } from "next/server";
import Rokaf from "../rokaf/rokaf";
import { serveStatus, Status } from "src/lib/time";
import { UserQueue, User } from "src/db";
import { ServerActionResponse } from ".././serverActionResponse";
// 로그인을 하면 먼저 DB에 저장한다.
// 편지쓰기 가능한 기간이면 국방부 사이트에서 존재하는지 확인하고, 아니면 그냥 둔다.
// 존재하는 유저면 connect를 true로 업데이트한다.
// 존재하지 않으면 users_queue에 추가한다.

/**
 * 입력 검증: 사용자의 세대, 생일, 아이디 중복, 비밀번호 길이, 이름 길이, 메시지 길이를 검증합니다.
 * 유저 생성: 검증을 통과하면 사용자 정보를 데이터베이스에 저장합니다.
 * 사용자 확인: 저장된 사용자 정보를 바탕으로, 국방부 사이트에서 사용자의 존재 여부를 확인합니다.
 * 상태에 따른 처리: 사용자의 세대에 따라 국방부 사이트에서의 존재 여부를 확인하고, 존재 여부에 따라 사용자를 UserQueue에 추가하거나 사용자 정보를 업데이트합니다.
 */
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
  // 입력 검증
  const valid = await validate({
    username,
    password,
    name,
    birth,
    generation,
    message,
  });
  if (!valid.validate) {
    return ServerActionResponse({ message: valid.message, status: 400 });
  }

  // 유저 생성
  const newUser = await User.insert({
    username,
    password,
    name,
    birth,
    generation,
    message,
  }).catch((error) => {
    throw ServerActionResponse({ message: error, status: 500 });
  });

  const id = newUser.id;

  // 빠른 응답을 위해 남은 로직은 비동기에서 진행
  asyncProcess({ id, name, birth, generation, username });

  return ServerActionResponse({ message: "회원가입 성공", status: 200 });
}

async function asyncProcess({ id, name, birth, generation, username }) {
  const status = serveStatus(generation);

  switch (status) {
    // 입대 전에는 유저큐에서 인편 열리기를 기다린다.
    case Status.before:
    case Status.beginning:
      await insertQueue(id);
      logger.info(
        `${username} (${id}) ${name}, ${birth}, ${generation} | user queue`,
      );
      break;
    // 전역 후에도 회원가입은 가능하다. 다만 편지를 못쓸 뿐
    case Status.training:
    case Status.ending:
    case Status.working:
    case Status.discharged:
      await findAndSaveUser(id, name, birth, generation, username);
      break;
  }

  return;
}

async function insertQueue(userId: number) {
  await UserQueue.insert({ userId });
}

async function findAndSaveUser(
  userId: number,
  name: string,
  birth: string,
  generation: number,
  username: string,
) {
  // 편지쓰기 이후 유저, 번호 찾기 시작

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
    // 유저 인증 실패, 인증 큐에 저장하는 중...
    await insertQueue(userId);
    logger.info(
      `${username} (${userId}) ${name} ${birth} ${generation} | false - user queue`,
    );
  }
}

async function validate({
  username,
  password,
  name,
  birth,
  generation,
  message,
}) {
  if (!validG(generation).valid) {
    return {
      message: validG(generation).text,
      validate: false,
    };
  }
  if (!validB(birth).valid) {
    return { message: validB(birth).text, validate: false };
  }

  if (await duplicateUsername(username)) {
    return {
      message: "아이디가 중복되었습니다.",
      validate: false,
    };
  }
  if (password.length < 4) {
    return { message: "비밀번호는 4자리 이상이여야합니다.", validate: false };
  }

  if (name.length > 100) {
    return { message: "이름은 100자 이하여야합니다.", validate: false };
  }

  if (message.length > 500) {
    return { message: "메시지는 500자 이하여야합니다.", validate: false };
  }

  return { message: "유효한 데이터 형식 입니다.", validate: true };
}
