import { notFound } from "next/navigation";

import { getPostById } from "src/app/apiSSR/user/server";
import { LoginPage } from "./LoginPage";


export const metadata = {
  title: "하늘인편 | 편지 로그인",
};

export default async function Page({ params, }) {

  const username = params.username;
  const postId = Number(params.postId);

  const post = await getPostById(postId);
  if (!post) notFound();

  if (post.user.username != username) notFound();

  return <LoginPage postId={postId} ></LoginPage>
}
