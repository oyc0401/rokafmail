import { NextResponse } from "next/server";
import Rokaf from "../rokaf/rokaf";
import { mailStartIsFuture } from "src/lib/time";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 로그인을 하면 먼저 DB에 저장한다.
// 편지쓰기 가능한 기간이면 국방부 사이트에서 존재하는지 확인하고, 아니면 그냥 둔다.
// 존재하는 유저면 connect를 true로 업데이트한다.
// 존재하지 않으면 users_queue에 추가한다.

export async function POST(request: Request) {
  console.log("회원가입 중...");

  // 인터넷 편지 사이트 프로필 가져오기
  const { username, password, name, birth, generation, message } =
    await request.json();

  // 유저 만들기
  const newUser = await createUser({
    username,
    password,
    name,
    birth,
    generation,
    message,
  });

  const id = newUser.id;

  checkUser({ id, name, birth, generation });

  return NextResponse.json({ message: "회원가입 성공" }, { status: 200 });
}

async function checkUser({ id, name, birth, generation }) {
  if (mailStartIsFuture(generation)) {
    console.log("편지쓰기 전 유저, 인증 큐에 저장하는 중...");
    await prisma.usersQueue.create({
      data: {
        userId: id,
      },
    });
    return console.log(`id: ${id} 회원가입 성공!`);
  }
  console.log("편지쓰기 이후 유저, 번호 찾기 시작.");
  // 유저가 존재하는지 확인
  const { memberSeq, sodae, connect } = await Rokaf.getProfile(name, birth);
  // 유저인증이 안되면 인증 테이블에 저장
  if (connect) {
    console.log(`유저 인증 성공 memberSeq:${memberSeq}, sodae:${sodae}`);
    console.log("정보 업데이트 중...");
    await prisma.user.update({
      where: {
        id,
      },
      data: {
        memberSeq,
        sodae,
        connect: true,
      },
    });
  } else {
    console.log("유저 인증 실패, 인증 큐에 저장하는 중...");
    await prisma.usersQueue.create({
      data: {
        userId: id,
      },
    });
  }

  return console.log(`id: ${id} 회원가입 성공!`);
}

const createUser = async (data: {
  username: string;
  password: string;
  name: string;
  birth: string;
  generation: number;
  message: string;
}) => {
  return await prisma.user.create({ data });
};
