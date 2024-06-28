import { Post, User } from "src/db";
import prisma from "src/db/prisma";

export async function getPostedPosts(username: string) {
  const postsPrivate = await prisma.post.findMany({
    select: privateSelect,
    where: { user: { username }, isPublic: false, posted: true },
  });
  const postsPublic = await prisma.post.findMany({
    select: publicSelect,
    where: { user: { username }, isPublic: true, posted: true },
  });

  const posts = [...postsPrivate, ...postsPublic];
  const postsSorted = posts.sort((a, b) => a.id > b.id ? -1 : 1);
  return postsSorted
}

export async function getNotPostedPosts(username: string) {
  const queuePrivate = await prisma.post.findMany({
    select: privateSelect,
    where: { user: { username }, isPublic: false, posted: false },
  });
  const queuePublic = await prisma.post.findMany({
    select: publicSelect,
    where: { user: { username }, isPublic: true, posted: false },
  });

  const queues = [...queuePrivate, ...queuePublic];
  const queueSorted = queues.sort((a, b) => a.id < b.id ? -1 : 1);
  return queueSorted;
}

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
  return queueSorted;
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