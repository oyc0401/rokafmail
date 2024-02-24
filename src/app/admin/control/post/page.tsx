import { PrismaClient } from "@prisma/client";
import prisma from "src/db/prisma";
import { useRouter } from "next/router";
import { DatabaseTable } from "./Table";
import { User ,Post} from "src/db";


export default async function UserController( ) {
  const data = await Post.findAll();

  return (
    <>
      <DatabaseTable data={data}></DatabaseTable>
    </>
  );
}