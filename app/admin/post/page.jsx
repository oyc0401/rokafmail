import { Table } from "../table";
import Link from "next/link";

export default async function Post() {
  const knex = require("knex")({
    client: "postgres",
    connection: process.env.DATABASE_URL,
    pool: { min: 0, max: 80 },
  });

  const data = await knex("post");

  console.log(data);

  knex.destroy();

  return (
    <>
      <div className=" mx-auto p-4">
        <div className="flex space-x-4 mb-4">
          <Link
            href="/admin/users"
            className="bg-white border border-gray-300 px-3 py-2"
          >
            유저
          </Link>
          <Link
            href="/admin/users_queue"
            className="bg-white border border-gray-300 px-3 py-2"
          >
            유저큐
          </Link>
          <Link
            href="/admin/post"
            className="bg-gray-500 border border-gray-300 px-3 py-2 text-white  font-bold"
          >
            편지
          </Link>
          <Link
            href="/admin/post_queue"
            className="bg-white border border-gray-300 px-3 py-2"
          >
            편지큐
          </Link>
          <Link
            href="/admin/unconnected_post"
            className="bg-white border border-gray-300 px-3 py-2"
          >
            안보내진편지
          </Link>
        </div>
        <Table data={JSON.parse(JSON.stringify(data))}></Table>
      </div>
    </>
  );
}
