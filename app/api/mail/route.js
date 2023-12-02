import axios from "axios";
import FormData from "form-data";
import sender from "./sender.js";
import repost from "./repost.js"

const knex = require("knex")({
  // We are using PostgreSQL
  client: "postgres",
  // Use the `DATABASE_URL` environment variable we provide to connect to the Database
  // It is included in your Replit environment automatically (no need to set it up)
  connection: process.env.DATABASE_URL,

  // Optionally, you can use connection pools to increase query performance
  pool: { min: 0, max: 80 },
});


export async function POST(request) {
  const body = await request.json();

  //  /write/oyc0401
 
  // 테이블 만들때 실행
  if (! await knex.schema.hasTable('post')) {
    await knex.schema.createTable('post', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.string('name');
      table.string('relationship');
      table.string('title');
      table.string('contents');
      table.string('password');
      table.dateTime('created_at').defaultTo(knex.fn.now());
      table.boolean('posted').defaultTo(false);
      table.dateTime('post_at').nullable();

    })

  }

  // console.log("DB 갑니다!")
  // let mail = {
  //   user_id: body.user_id,
  //   name: body.name,
  //   relationship: body.relationship,
  //   title: body.title,
  //   contents: body.contents,
  //   password: body.password,
  // }
  // console.log("얍!")
  // // add mail
  // await knex("post").insert(mail);
  // console.log("성공!")

  await repost();


  




  return new Response('Hello, Next.js!', {
    status: 200
  })




}