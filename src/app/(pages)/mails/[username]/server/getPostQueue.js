export async function getPostQueue(username){
  const knex = require("knex")({
    client: "postgres",
    connection: process.env.DATABASE_URL,
    pool: { min: 0, max: 80 },
  });

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