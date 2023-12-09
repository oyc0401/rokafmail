"use server";
const knex = require("knex")({
  client: "postgres",
  connection: process.env.DATABASE_URL,
  pool: { min: 0, max: 80 },
});

export async function avaliableUsername(username) {
  console.log("아이디 중복확인 중...");
  const result = await knex("users")
    .where({ username })
    .count("id as count")
    .first();

  // 중복된 값이 없으면 0
  let data = result.count == 0;
  console.log("아이디 중복확인 완료!", data);;

  return data;
}
