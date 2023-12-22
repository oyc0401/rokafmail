"use server";

export async function getUser(username) {
  const knex = require("knex")({
    client: "postgres",
    connection: process.env.DATABASE_URL,
    pool: { min: 0, max: 80 },
  });

  const result = await knex("users")
    .where("username", username)
    .first();

  return result;
}
