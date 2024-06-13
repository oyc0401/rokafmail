import { Post, User } from "src/db";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { auth } from "src/app/api/auth/auth";
import { View } from './view'

export const metadata = {
  title: "하늘인편 | 편지 확인",
};

export default async function Page({ params }) {
  const postId = Number(params.postId);
  const post = await Post.findById(postId);
  if (!post) notFound();

  // 세션
  const session = await auth();
  if (!session || !session.user || !session.user.email)
    redirect("/auth/signin");

  const username = session.user.email;
  const user = await User.findByUsername(username);
  if (!user) notFound();
  
  return <View postId={postId} />;
  
  

}
