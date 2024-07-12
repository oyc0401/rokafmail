import { User } from "src/db";
import { notFound } from "next/navigation";
import prisma from "src/db/prisma";
const defalutUserSelect = {
  id: true,
  username: true,
  name: true,
  birth: true,
  generation: true,
  message: true,
  memberSeq: true,
  sodae: true,
  connect: true,
  createdAt: true,
}


export async function notFoundByUsername(username: string) {
  const user = await User.findByUsername(username);
  if (!user) notFound();
}


export async function getUserById(userId: number) {
  const user = await prisma.user.findUnique({
    select: defalutUserSelect,
    where: { id: userId }
  });

  return user;
}

export async function getUserByUsername(username: string) {
  const user = await prisma.user.findUnique({
    select: defalutUserSelect,
    where: { username: username }
  });

  return user;
}


