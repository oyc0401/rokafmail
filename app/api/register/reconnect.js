
import { getProfile } from './parser';

// knex
const knex = require("knex")({
  client: "postgres",
  connection: process.env.DATABASE_URL,
  pool: { min: 0, max: 80 },
});


export async function reconnect() {


  const unconnected = await knex('users')
    .where('connect', false);

  console.log("reconnect: 유저 인증 시작, 미인증 유저 수:", unconnected.length)

  for (const user of unconnected) {
    let data = await getProfile(user.name, user.birth);
    await knex("users")
      .where("id", user.id)
      .update(data);
  }

  console.log("reconnect: 모든 인증 완료.")
}