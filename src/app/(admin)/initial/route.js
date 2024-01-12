const knex = require("knex")({
  client: "postgres",
  connection:
    "postgres://postgres:chan0401@rokafmail.cr68iaqe6qwa.ap-northeast-2.rds.amazonaws.com/postgres?sslmode=require",
  // connection:'postgres://neon:go5SiZ8LGkwu@ep-winter-union-23827944.us-east-2.aws.neon.tech/neondb?sslmode=require&options=project%3Dep-winter-union-23827944',
  // connection: process.env.DATABASE_URL,
  // connection: {
  //   user: "postgres",
  //   host: "rokafmail.cr68iaqe6qwa.ap-northeast-2.rds.amazonaws.com",
  //   database: "postgres",
  //   password: "chan0401",
  //   port: 5432,
  // },
  ssl: { rejectUnauthorized: false },
  pool: { min: 0, max: 80 },
});
export async function GET(request) {

  return new Response(200);
}
