"use server";
const knex = require("knex")({
  client: "postgres",
  connection: process.env.DATABASE_URL,
  pool: { min: 0, max: 80 },
});


export async function getUser(username) {
  const result = await knex("users").where("username", username).first();
  
  return result;
}
