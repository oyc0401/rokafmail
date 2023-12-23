import Rokaf from "../rokaf/rokaf";

export async function repostMail() {
  // knex
  const knex = require("knex")({
    client: "postgres",
    connection: process.env.DATABASE_URL,
    pool: { min: 0, max: 80 },
  });

  // 미인증 유저들
  const unconnected = await knex("users_queue")
    .select("users_queue.*", "users.name", "users.birth")
    .innerJoin("users", "users_queue.user_id", "users.id");

  console.log(unconnected);

  console.log("reconnect: 유저 인증 시작, 미인증 유저 수:", unconnected.length);

  for (const user of unconnected) {
    let data = await Rokaf.getProfile(user.name, user.birth);

    if (data.connect) {
      await knex("users").where("id", user.user_id).update(data);
      await knex("users_queue").where("id", user.id).del();

    }
  }

  knex.destroy();
  console.log("reconnect: 모든 인증 완료.");
}
