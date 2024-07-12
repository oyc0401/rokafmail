import prisma from "src/db/prisma";

interface MailList {
  id: number;
  userId: number;
  name: string;
  relationship: string;
  title: string;
  contents?: string;
  createdAt: Date;
  posted: boolean;
  postAt: Date | null;
  isPublic: boolean;
  user: {
    username: string;
    generation: number;
    connect: boolean;
  };
}

export async function getMyPosts(username: string) {
  const postsPrivate = await prisma.post.findMany({
    select: privateSelect,
    where: { user: { username }, isPublic: false },
  });
  const postsPublic = await prisma.post.findMany({
    select: publicSelect,
    where: { user: { username }, isPublic: true },
  });

  const posts: MailList[] = [...postsPrivate, ...postsPublic];
  const postsSorted = posts.sort((a, b) => a.id > b.id ? -1 : 1);
  return postsSorted
}

const defaultPostSelect = {
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
  ...defaultPostSelect,
}

const publicSelect = {
  ...defaultPostSelect,
  contents: true,
}