"use server";

const knex = require("knex")({
  client: "postgres",
  connection: process.env.DATABASE_URL,
  pool: { min: 0, max: 80 },
});

// 보내는데 성공한 편지를 보여줌
export async function getPost(username) {
  const posts = await knex("post")
    .select("post.*", "users.username", "users.connect")
    .innerJoin("users", "post.user_id", "users.id")
    .where("username", username).where('posted',true);

  return posts;
}

export async function getPostQueue(username){
  const unconnected = await knex("post_queue")
    .select(
      "post_queue.*",
       "users.username",
       "users.connect",
      "post.title",
      "post.relationship",
      "post.created_at",
    )
    .innerJoin("post", "post_queue.post_id", "post.id")
    .innerJoin("users", "post_queue.user_id", "users.id")
    .where('username',username);

  return unconnected;
}

export async function getUnconnectedPost(username){
  const unconnected = await knex("unconnected_post")
    .select(
      "unconnected_post.*",
       "users.username",
       "users.connect",
      "post.title",
      "post.relationship",
      "post.created_at",
    )
    .innerJoin("post", "unconnected_post.post_id", "post.id")
    .innerJoin("users", "unconnected_post.user_id", "users.id")
    .where('username',username);

  return unconnected;
}