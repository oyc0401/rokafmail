import { PrismaClient } from "@prisma/client";
import prisma from "src/db/prisma";
import { useRouter } from "next/router";
import { Table } from "./Table";


export default async function LinkPage({ params }) {
  const tableName = params.table;
  // console.log(tableName);

  const data = await prisma.user.findMany();

  const column = [
    {
      width: 100,
      column: "id",
    },
    {
      width: 200,
      column: "username",
    },
    {
      width: 300,
      column: "name",
    },
  ];

  return (
    <>
      <Table column={column} data={data}></Table>
    </>
  );
}

function toJson(text) {
  return JSON.parse(JSON.stringify(text));
}
