import { notFound } from "next/navigation";
import { LoginPage } from "./LoginPage";
import { getPostWithUserById } from "src/app/apiSSR/mail/server";


export const metadata = {
  title: "하늘인편 | 편지 로그인",
};

export default async function Page({ params, }) {

  const username = decodeURI(params.username);
  const postId = Number(params.postId);

  const post = await getPostWithUserById(postId);
  if (!post) notFound();

  if (post.user.username != username) notFound();

  return <LoginPage postId={postId} ></LoginPage>
}
