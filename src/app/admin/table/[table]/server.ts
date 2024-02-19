"use server";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function deleteObj(name, id) {
  console.log(name, id, "삭제");
  //  await prisma[name].delete({
  //   where: {
  //     id
  //   },
  // })
}
