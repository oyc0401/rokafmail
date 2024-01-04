import Rokaf from '../rokaf/rokaf'

const knex = require("knex")({
  client: "postgres",
  connection: process.env.DATABASE_URL,
  pool: { min: 0, max: 80 },
});

export async function POST(request) {
  console.log("회원가입 중...");
  const body = await request.json();

  // 인터넷 편지 사이트 프로필 가져오기
  const searchName = body.name;
  const searchBirth = body.birth;

  // 유저가 존재하는지 확인
  let data = await Rokaf.getProfile(searchName, searchBirth);

  // user table에 사용자 추가
  let user = {
    username: body.username,
    password: body.password,
    name: body.name,
    birth: body.birth,
    generation: body.generation,
    memberSeq: data.memberSeq,
    sodae: data.sodae,
    connect: data.connect,
      message:body.message,
  };
  const userIdObj = await knex("users").returning("id").insert(user);
  const userId = userIdObj[0].id;

  // console.log(userId);

  console.log("users 추가");

  // 유저인증이 안되면 인증 테이블에 저장
  if (data.connect) {
    console.log("유저 인증 확인!");
  } else {
    console.log("유저 인증 실패, 인증 큐에 저장합니다.");

    let userqueueData = {
      user_id: userId,
    };
    await knex("users_queue").insert(userqueueData);
    console.log("users_queue 추가");
  }

  console.log("회원가입 성공!");

  knex.destroy(); // knex 종료
  return new Response("회원가입 성공!", {
    status: 200,
  });
}
