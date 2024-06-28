import prisma from "src/db/prisma";

// 해당 아이디와 편지가 같은 사람이 아니면 notFound
export async function isSameUser(postId: number, username: string) {
  const post = await prisma.post.findUnique({
    select: {
      user: { select: { username: true } }
    },
    where: { id: postId },
  });

  return post?.user.username == username;
}