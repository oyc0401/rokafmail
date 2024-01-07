const knex = require("knex")({
  client: "postgres",
  connection:
    "postgres://postgres:chan0401@rokafmail.cr68iaqe6qwa.ap-northeast-2.rds.amazonaws.com:5432/postgres?sslmode=require",
  // connection:'postgres://neon:go5SiZ8LGkwu@ep-winter-union-23827944.us-east-2.aws.neon.tech/neondb?sslmode=require&options=project%3Dep-winter-union-23827944',
  // connection: process.env.DATABASE_URL,
  // connection: {
  //   user: "postgres",
  //   host: "rokafmail.cr68iaqe6qwa.ap-northeast-2.rds.amazonaws.com",
  //   database: "postgres",
  //   password: "chan0401",
  //   port: 5432,
  // },
  // ssl: { rejectUnauthorized: false },
  pool: { min: 0, max: 80 },
});
export async function GET(request) {
  // users table
  if (!(await knex.schema.hasTable("users"))) {
    await knex.schema.createTable("users", (table) => {
      table.increments("id").primary();
      table.string("username");
      table.string("password");
      table.string("name");
      table.string("birth");
      table.integer("generation");
      table.string("message");
      table.string("memberSeq").nullable();
      table.string("sodae").nullable();
      table.boolean("connect").defaultTo(false);
    });
  }

  // users_queue table
  if (!(await knex.schema.hasTable("users_queue"))) {
    await knex.schema.createTable("users_queue", (table) => {
      table.increments("id").primary();
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
    });
  }

  // 테이블 만들때 실행
  if (!(await knex.schema.hasTable("post"))) {
    await knex.schema.createTable("post", (table) => {
      table.increments("id").primary();
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table.string("name");
      table.string("relationship");
      table.string("title");
      table.string("contents");
      table.string("password");
      table.dateTime("created_at").defaultTo(knex.fn.now());
      table.boolean("posted").defaultTo(false);
      table.dateTime("post_at").nullable();
    });
  }

  // 인증안된 유저가 기다리고 있는 큐
  if (!(await knex.schema.hasTable("unconnected_post"))) {
    await knex.schema.createTable("unconnected_post", (table) => {
      table.increments("id").primary();
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table
        .integer("post_id")
        .unsigned()
        .references("id")
        .inTable("post")
        .onDelete("CASCADE");
    });
  }

  // 인증된 유저가 기다리고 있는 큐
  if (!(await knex.schema.hasTable("post_queue"))) {
    await knex.schema.createTable("post_queue", (table) => {
      table.increments("id").primary();
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table
        .integer("post_id")
        .unsigned()
        .references("id")
        .inTable("post")
        .onDelete("CASCADE");
    });
  }
  return new Response(200);
}
