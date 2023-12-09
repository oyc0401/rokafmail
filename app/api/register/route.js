import { getProfile } from "./parser";

const knex = require("knex")({
  // We are using PostgreSQL
  client: "postgres",
  // Use the `DATABASE_URL` environment variable we provide to connect to the Database
  // It is included in your Replit environment automatically (no need to set it up)
  connection: process.env.DATABASE_URL,

  // Optionally, you can use connection pools to increase query performance
  pool: { min: 0, max: 80 },
});

export async function POST(request) {
  console.log("회원가입 중...");
  const body = await request.json();

  // 인터넷 편지 사이트 프로필 가져오기
  const searchName = body.name;
  const searchBirth = body.birth;

  // 유저가 존재하는지 확인
  let data = await getProfile(searchName, searchBirth);

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
    substring:body.substring,
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
      birth: body.birth,
      name: body.name,
    };
    await knex("users_queue").insert(userqueueData);
    console.log("users_queue 추가");
  }

  console.log("회원가입 성공!");

  knex.destroy(); // knex 종료
  return new Response("회원가입 성공!", {
    status: 200,
  });

  // 이 코드에 쓰인 테이블 정보입니다!

  return; // return 뒤에있어서 실행 X

  // users table
  if (!(await knex.schema.hasTable("users"))) {
    await knex.schema.createTable("users", (table) => {
      table.increments("id").primary();
      table.string("username");
      table.string("password");
      table.string("name");
      table.string("birth");
      table.string("generation");
      table.string("substring");
      table.string("memberSeq").nullable();
      table.string("sodae").nullable();
      table.boolean("connect").defaultTo(false);
    });
  }

  // users_queue table
  if (!(await knex.schema.hasTable("users_queue"))) {
    await knex.schema.createTable("users_queue", (table) => {
      table.increments("id").primary();
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table.string("name");
      table.string("birth");
    });
  }

  // end
}
