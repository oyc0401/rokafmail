import { Post, User } from "src/db";
import { notFound } from "next/navigation";

export async function notFoundByUsername(username: string) {
  const user = await User.findByUsername(username);
  if (!user) notFound();
}

export async function getUserByUsername(username: string) {
  const user = await User.findByUsername(username);

  return user;
}
export async function getUserById(userId: number) {
  const user = await User.findById(userId);

  return user;
}



export async function getPostById(postId: number) {
  const post = await Post.findById(postId);

  return post;
}
