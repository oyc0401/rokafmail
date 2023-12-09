const knex = require("knex")({
  // We are using PostgreSQL
  client: "postgres",
  // Use the `DATABASE_URL` environment variable we provide to connect to the Database
  // It is included in your Replit environment automatically (no need to set it up)
  connection: process.env.DATABASE_URL,

  // Optionally, you can use connection pools to increase query performance
  pool: { min: 0, max: 80 },
});

export async function  GET(request) {
  console.log("코드 실행!");

  // 열 추가
  await knex.schema.table('users_queue', function (table) {
    table.string("name");
    table.string("birth");
  })


  
  // 테이블 만들때 실행

  // if (!(await knex.schema.hasTable("users_queue"))) {
  //   await knex.schema.createTable("users_queue", (table) => {
  //     table.increments("id").primary();
  //     table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
  //   });
  // }


   knex.destroy();
  return new Response(200);
}