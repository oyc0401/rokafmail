import { NextResponse } from "next/server";
import { getNow } from "src/lib/time";
import Rokaf from "../rokaf/rokaf";

const knex = require("knex")({
  client: "postgres",
  connection: process.env.DATABASE_URL,
  pool: { min: 0, max: 80 },
});

// 편지를 보내면 먼저 post에 저장한다.
// 인증안된 유저면 unconnected에 추가
// 인증된 유저는
// 편지쓰기 가능한 기간이면 보내고 아니면 그냥 둔다.
// 보내지면 posted를 true로 업데이트한다.
// 안보내지면 post_queue에 추가한다.

export async function POST(request: Request) {
  const body = await request.json();

  const { user_id, username, name, relationship, title, contents, password } =
    body;

  // 유저인지 확인
  const userList = await knex("users").where("username", username);

  // 유저가 아니면 400에러 ㄱㄱ
  if (userList.length == 0) {
    return NextResponse.json(
      { message: "해당 유저를 찾을 수 없습니다." },
      { status: 400 },
    );
  }

  let [user] = userList;
  const { memberSeq, sodae, connect } = user;

  console.log(`${username} 편지 업로드 중...`);
  console.log(`connect: ${connect}`);

  // 편지 저장
  let [postObj] = await knex("post").returning("id").insert({
    user_id: user_id,
    name: name,
    relationship: relationship,
    title: title,
    contents: contents,
    password: password,
  });

  let post_id = postObj.id;

  console.log("post 업로드 성공!");

  // 인증안된 유저면 인증안된 큐에 데이터 저장
  if (!connect) {
    insertUnconnected({
      post_id: post_id,
      user_id: user_id,
      username: username,
    });
  } else {
    sendMail({
      user_id: user_id,
      post_id: post_id,
      username: username,
      name: name,
      relationship: relationship,
      title: title,
      contents: contents,
      password: password,
      memberSeq: memberSeq,
      sodae: sodae,
    });
  }

  return NextResponse.json({ message: "편지 전송 성공!" }, { status: 200 });
}

async function insertUnconnected({ post_id, user_id, username }) {
  console.log("unconnected_post 업로드 중...");
  await knex("unconnected_post").insert({
    post_id: post_id,
    user_id: user_id,
  });
  console.log("unconnected_post 업로드 성공!");
  console.log(`${username} 편지 전송 완료`);
}

async function sendMail({
  user_id,
  post_id,
  username,
  name,
  relationship,
  title,
  contents,
  password,
  memberSeq,
  sodae,
}) {
  console.log("국방부 서버 보내는 중...");
  // 인증된 유저면 국방부에 보내보기
  const response = await Rokaf.postMail({
    name: name,
    relationship: relationship,
    title: title,
    contents: contents,
    password: password,
    memberSeq: memberSeq,
    sodae: sodae,
  });

  // 국방서버에 보내졌으면 보내졌다고 업데이트
  if (response.complete) {
    console.log("국방부 서버 보내기 성공!");
    await knex("post")
      .where({ id: post_id })
      .update({ posted: true, post_at: getNow() });
  } else {
    // 안보내졌으면 편지큐에 저장
    console.log("국방부 서버 보내기 실패.");
    console.log("post_queue 업로드 중...");
    await knex("post_queue").insert({
      post_id: post_id,
      user_id: user_id,
    });
    console.log("post queue 업로드 성공!");
  }

  console.log(`${username} 편지 전송 완료`);
}
