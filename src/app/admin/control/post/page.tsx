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

  const transformedArray = data.map((item) => {
    // 각 객체에 대해 user와 post 속성을 해체하여 상위 객체에 통합
    return {
      ...item,
      ...item.user
    };
  });
  
  return (
    <>
      <h2 className="font-bold text-2xl mb-4">Post</h2>
      <DatabaseTable key={"2"} data={transformedArray}></DatabaseTable>
    </>
  );
}
