import { PrismaClient } from "@prisma/client";
import prisma from "src/db/prisma";
import { useRouter } from "next/router";
import { DatabaseTable } from "./Table";
import { User, Post, PostQueue } from "src/db";

export default async function UserController() {
  const data = await PostQueue.findAll();

  
  const transformedArray = data.map((item) => {
    // 각 객체에 대해 user와 post 속성을 해체하여 상위 객체에 통합
    return {
      ...item,
      ...item.user,
      ...item.post,
    };
  });

  return (
    <>
      <DatabaseTable data={transformedArray}></DatabaseTable>
    </>
  );
}
