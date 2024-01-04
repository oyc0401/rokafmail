import Rokaf from "../rokaf/rokaf";
const knex = require("knex")({
  client: "postgres",
  connection: process.env.DATABASE_URL,
  pool: { min: 0, max: 80 },
});

export async function verifyUser() {
  console.log("verifyUser...");
  // 미인증 유저들
  const unconnected = await knex("users_queue")
    .select("users_queue.*", "users.name", "users.birth")
    .innerJoin("users", "users_queue.user_id", "users.id");

  // console.log(unconnected);

  console.log("reconnect: 유저 인증 시작, 미인증 유저 수:", unconnected.length);

  for (const user of unconnected) {
    let data = await Rokaf.getProfile(user.name, user.birth);

    // 서버가 통신이 끊기면 바로 종료
    if (!data.serverOn) {
      console.log("verifyUser Stopped!");
      return;
    }
    if (data.connect) {
      console.log(data);
      await updateUser(user.id, user.sodae, user.memberSeq);
      await moveQueue(user.user_id);
    }
  }

  console.log("verifyUser Complete!");
}

async function updateUser(userId, sodae, memberSeq) {
  await knex("users").where({ id: userId }).update({
    connect: true,
    sodae: sodae,
    memberSeq: memberSeq,
  });
  await knex("users_queue").where({ id: userId }).del();
}

async function moveQueue(userId) {
  let posts = await knex("unconnected_post").where("user_id", userId);
  console.log(posts);
  for (const post of posts) {
    await knex("post_queue").insert({
      user_id: post.user_id,
      post_id: post.post_id,
    });
  }

  // delete all
  await knex("unconnected_post").where("user_id", userId).del();
}
