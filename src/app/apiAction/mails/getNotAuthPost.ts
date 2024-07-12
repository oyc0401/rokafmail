"use server";

import { ActionResponse } from "src/app/apiSSR/actionResponse";
import prisma from "src/db/prisma";

/**
 * `Server Action`
 * 
 * 해당 편지를 삭제한다.
 * @status `200` `401` `404`
 */
export async function getNotAuthPosts(username: string) {
  const queuePrivate = await prisma.post.findMany({
    select: privateSelect,
    where: { user: { username }, isPublic: false, posted: false },
  });
  const queuePublic = await prisma.post.findMany({
    select: publicSelect,
    where: { user: { username }, isPublic: true, posted: false },
  });

  const queues = [...queuePrivate, ...queuePublic];
  const queueSorted = queues.sort((a, b) => a.id > b.id ? -1 : 1);
  return ActionResponse.ok(queueSorted);
}

const postSelect = {
  id: true,
  userId: true,
  name: true,
  relationship: true,
  title: true,
  createdAt: true,
  posted: true,
  postAt: true,
  isPublic: true,
  user: {
    select: {
      username: true,
      connect: true,
      generation: true,
    },
  },
}
const privateSelect = {
  ...postSelect,
}

const publicSelect = {
  ...postSelect,
  contents: true,
}