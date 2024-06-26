import { cookies } from "next/headers";
import { notFound } from "next/navigation";
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

// 유저와 편지 비밀번호가 포함된 편지
export async function getPostView(postId: number, username: string) {
  const post = await prisma.post.findUnique({
    select: {
      ...defalutPostSelect,
      password: true,
      user: { select: defalutUserSelect }
    },
    where: { id: postId },
  });

  if (!post) notFound();

  if (post.user.username != username) notFound();

  // 공개글이면 이동
  if (post.isPublic) return post;

  // 비공개 글이면 주인 확인
  const password = post.password;
  const cookieStore = cookies();
  const pwcookie = cookieStore.get("password");

  if (pwcookie && pwcookie.value == password)
    return post;

  return post;
}

// 내용과 비밀번호가 포함된 편지
export async function getPostContentPassword(postId: number) {
  const post = await prisma.post.findUnique({
    select: {
      ...defalutPostSelect,
      password: true,
      contents: true,
    },
    where: { id: postId },
  });
  return post;
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