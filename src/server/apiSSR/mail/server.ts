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