import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { Post, User } from "src/db";
import prisma from "src/db/prisma";


// 기본 편지
export async function getPostById(postId: number) {
  const post = await prisma.post.findUnique({
    select: defalutPostSelect,
    where: { id: postId },
  });

  return post;
}

// 유저가 포함된 편지
export async function getPostWithUserById(postId: number) {
  const post = await prisma.post.findUnique({
    select: {
      ...defalutPostSelect,
      user: { select: defalutUserSelect }
    },
    where: { id: postId },
  });

  return post;
}

// 다 포함된 편지
export async function getPostEverything(postId: number) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });
  return post;
}

// 내용이 포함된 편지
export async function getPostContent(postId: number) {
  const post = await prisma.post.findUnique({
    select: {
      ...defalutPostSelect,
      contents: true,
    },
    where: { id: postId },
  });
  return post;
}

// 해당 아이디와 편지id가 같은 사람이 아니면 notFound
export async function isSameUser(postId: number, username: string) {
  const post = await prisma.post.findUnique({
    select: {
      user: { select: { username: true } }
    },
    where: { id: postId },
  });

  if (!post) notFound();

  // 아이디와 편지 주인이 같지 않으면 notFound
  if (post.user.username != username) notFound();
}

const defalutPostSelect = {
  id: true,
  userId: true,
  name: true,
  relationship: true,
  title: true,
  createdAt: true,
  posted: true,
  postAt: true,
  isPublic: true,
}

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