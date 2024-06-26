import { notFound, redirect } from "next/navigation";
import { auth } from "src/app/api/auth/auth";
import { View } from './view'
import { getPostById, getUserByUsername } from "src/app/apiSSR/user/server";

export const metadata = {
  title: "하늘인편 | 편지 확인",
};

export default async function Page({ params }) {
  const postId = Number(params.postId);
  const post = await getPostById(postId);
  if (!post) notFound();

  // 세션
  const session = await auth();
  if (!session || !session.user || !session.user.email)
    redirect("/auth/signin");

  const username = session.user.email;
  const user = await getUserByUsername(username);
  if (!user) notFound();
  
  return <View postId={postId} />;
  
  

}
