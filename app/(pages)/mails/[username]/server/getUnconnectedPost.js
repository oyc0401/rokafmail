export async function getUnconnectedPost(username){
  const knex = require("knex")({
    client: "postgres",
    connection: process.env.DATABASE_URL,
    pool: { min: 0, max: 80 },
  });

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