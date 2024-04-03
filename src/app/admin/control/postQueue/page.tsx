import { PrismaClient } from "@prisma/client";
import prisma from "src/db/prisma";
import { useRouter } from "next/router";
import { DatabaseTable } from "./Table";
import { User, Post, PostQueue } from "src/db";

export default async function UserController({ searchParams }) {
  if (searchParams.userId) {
    const data = await PostQueue.findByUserIdTable(Number(searchParams.userId));

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
        <h2 className="font-bold text-2xl mb-4">{`PostQueue - user id:${searchParams.userId}`}</h2>
        <DatabaseTable key={"1"} data={transformedArray}></DatabaseTable>
      </>
    );
  }

  const data = await PostQueue.findAll();

  const transformedArray = data.map((item) => {
    // 각 객체에 대해 user와 post 속성을 해체하여 상위 객체에 통합
    return{
      ...item.user,
      ...item.post,
      ...item,
    };
  });

  return (
    <>
      <h2 className="font-bold text-2xl mb-4">{`PostQueue`}</h2>
      <DatabaseTable key={"2"} data={transformedArray}></DatabaseTable>
    </>
  );
}
