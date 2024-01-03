// 보내는데 성공한 편지를 보여줌
export async function getPost(username) {
  const knex = require("knex")({
    client: "postgres",
    connection: process.env.DATABASE_URL,
    pool: { min: 0, max: 80 },
  });

  const posts = await knex("post")
    .select("post.*", "users.username", "users.connect")
    .innerJoin("users", "post.user_id", "users.id")
    .where("username", username).where('posted',true);

  return posts;
}
