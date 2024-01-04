import Rokaf from "../rokaf/rokaf";
import {getNow} from 'src/lib/time';

// knex
const knex = require("knex")({
  client: "postgres",
  connection: process.env.DATABASE_URL,
  pool: { min: 0, max: 80 },
});

async function uploadPost(body, completed = false) {
  const knex = require("knex")({
    client: "postgres",
    connection: process.env.DATABASE_URL,
    pool: { min: 0, max: 80 },
  });

  console.log("post 업로드 중...");
  let mail = {
    user_id: body.user_id,
    name: body.name,
    relationship: body.relationship,
    title: body.title,
    contents: body.contents,
    password: body.password,
  };
  // 성공시?
  if (completed) {
    mail.posted = true;
    mail.post_at = getNow();
  }

  // add mail
  let postData = await knex("post").returning("id").insert(mail);
  let postId = postData[0].id;
  console.log("post 업로드 성공!");

  knex.destroy();
  return postId;
}

export async function POST(request) {
  const body = await request.json();

  // 유저인지 확인
  const userList = await knex("users").where("username", body.username);

  // 유저가 아니면 400에러 ㄱㄱ
  if (userList.length == 0) {
    return new Response("해당 유저를 찾을 수 없습니다.", {
      status: 400,
    });
  }

  // 해당 유저 인증확인
  let user = userList[0];
  let connect = user.connect;

  console.log(`${user.username} 편지 업로드 중...`);
  console.log(`connect: ${connect}`);
  // console.log(user,body);

  // 인증안된 유저면 인증안된 큐에 데이터 저장
  if (!connect) {
    let postId = await uploadPost({
      user_id: user.id,
      name: body.name,
      relationship: body.relationship,
      title: body.title,
      contents: body.contents,
      password: body.password,
    }); // 기본 설정으로 저장

    console.log("unconnected_post 업로드 중...");
    let unconnectedPost = {
      post_id: postId,
      user_id: user.id,
    };
    console.log(unconnectedPost);
    await knex("unconnected_post").insert(unconnectedPost);
    console.log("unconnected_post 업로드 성공!");

    knex.destroy();
    console.log(`${user.username} 편지 전송 완료`);
    return new Response("편지 전송 성공: 인증 안된 유저", {
      status: 200,
    });
  }

  // 인증된 유저면 국방부에 보내보기

  let postComplete = await Rokaf.postMail({
    name: body.name,
    relationship: body.relationship,
    title: body.title,
    contents: body.password,
    password: body.password,
    memberSeq: user.memberSeq,
    sodae: user.sodae,
  }); // 국방서버에 보내는 요청

  // 국방서버에 보내졌으면 편지 DB에 저장하기
  if (postComplete.complete) {
   await uploadPost(
      {
        user_id: user.id,
        name: body.name,
        relationship: body.relationship,
        title: body.title,
        contents: body.contents,
        password: body.password,
      },
      true,
    ); // 기본 설정으로 저장
    console.log(`${user.username} 편지 전송 완료`);
    return new Response("편지 전송 성공!: 국방부 서버 성공!", {
      status: 200,
    });
  } else {
    // 안보내졌으면 편지큐에 저장
    console.log("국방부 서버 보내기 실패..");
    let postId = await uploadPost({
      user_id: user.id,
      name: body.name,
      relationship: body.relationship,
      title: body.title,
      contents: body.contents,
      password: body.password,
    }); // 기본 설정으로 저장

    console.log("post_queue 업로드 중...");
    let post_queue = {
      post_id: postId,
      user_id: user.id,
    };
    await knex("post_queue").insert(post_queue);
    console.log("post queue 업로드 성공!");

    console.log(`${user.username} 편지 전송 완료`);
    return new Response("편지 전송 성공!: 국방부 서버 오류, 대기중!", {
      status: 200,
    });
  }
}
