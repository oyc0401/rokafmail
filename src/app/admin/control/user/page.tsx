import { PrismaClient } from "@prisma/client";
import prisma from "src/db/prisma";
import { useRouter } from "next/router";
import { DatabaseTable } from "./Table";
import { User } from "src/db";


export default async function UserController( ) {
  const data = await User.findAllTable();
  return (
    <>
      <h2 className="font-bold text-2xl mb-4">{`User`}</h2>
      <DatabaseTable data={data}></DatabaseTable>
    </>
  );
}