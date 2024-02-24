import { PrismaClient } from "@prisma/client";
import prisma from "src/db/prisma";
import { useRouter } from "next/router";
import { DatabaseTable } from "./Table";
import { User, Post } from "src/db";

export default async function UserController({ searchParams }) {
  if (searchParams.userId) {
    const data = await Post.findByUserIdTable(Number(searchParams.userId));
    return (
      <>
        <h2 className="font-bold text-2xl mb-4">{`Post - user id:${searchParams.userId}`}</h2>
        <DatabaseTable key={"1"} data={data}></DatabaseTable>
      </>
    );
  }
  const data = await Post.findAll();
  return (
    <>
      <h2 className="font-bold text-2xl mb-4">Post</h2>
      <DatabaseTable key={"2"} data={data}></DatabaseTable>
    </>
  );
}
