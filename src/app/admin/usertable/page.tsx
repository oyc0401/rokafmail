import { PrismaClient } from "@prisma/client";
import prisma from "src/db/prisma";
import { useRouter } from "next/router";
import { DatabaseTable } from "./Table";


export default async function LinkPage({ params }) {
  const tableName = params.table;
  // console.log(tableName);

  const data = await prisma.user.findMany();

  
  return (
    <>
      <DatabaseTable data={data}></DatabaseTable>
    </>
  );
}