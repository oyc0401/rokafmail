import { getProfile } from './parser';
import { reconnect } from './reconnect';


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

  const body = await request.json();

  // 인터넷 편지 사이트 프로필 가져오기
  const searchName = body.name;
  const searchBirth = body.birth;

  let data = await getProfile(searchName, searchBirth);

  console.log("good!")
  console.log(data);

  console.log("DB 갑니다!")
  let user = {
    username: body.username,
    password: body.password,
    name: body.name,
    birth: body.birth,
    generation: body.generation,
    memberSeq: data.memberSeq,
    sodae: data.sodae,
    connect: data.connect,
  }
  console.log("얍!")
  // add user
  await knex("users").insert(user);


  console.log("성공!")

  reconnect();

  return new Response('Hello, Next.js!', {
    status: 200
  })



  // 테이블 만들때 실행

  if (! await knex.schema.hasTable('users')) {
    await knex.schema.createTable('users', (table) => {
      table.increments('id').primary();
      table.string('username');
      table.string('password');
      table.string('name');
      table.string('birth');
      table.string('generation');
      table.string('memberSeq').nullable();
      table.string('sodae').nullable();
      table.boolean('connect').defaultTo(false);
    });

  }











}
