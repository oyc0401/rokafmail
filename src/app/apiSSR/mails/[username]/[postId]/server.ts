import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import prisma from "src/db/prisma";

// 해당 아이디와 편지가 같은 사람이 아니면 notFound
export async function isPostOwner(postId: number, username: string) {
  const post = await prisma.post.findUnique({
    select: {
      user: { select: { username: true } }
    },
    where: { id: postId },
  });

  return post?.user.username == username;
}
/**
 * 해당 postId의 편지 내용을 불러온다.
 * 편지가 비공개라면 쿠키에 있는 비밀번호를 확인하고
 * 틀리면 null을 반환한다.
 */
export async function getMail(postId: number) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) notFound();

  const { id, title, contents, name, relationship, posted, isPublic, createdAt } = post;
  const props = { id, title, contents, name, relationship, isPublic, posted, createdAt };

  // 공개글이면 이동
  if (post.isPublic) {
    return props;
  }

  // 비공개 글이면 주인 확인  
  const cookieStore = cookies();
  const pwcookie = cookieStore.get("password");

  // 쿠키에 있는게 비밀번호면 주인.
  if (pwcookie && pwcookie.value == post.password)
    return props;

  return null;
}