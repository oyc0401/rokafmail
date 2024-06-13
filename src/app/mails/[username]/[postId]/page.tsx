import { Post } from "src/db";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { View } from './view'

export const metadata = {
  title: "하늘인편 | 편지 확인",
};

export default async function Page({ params }) {
  const postId = Number(params.postId);
  const username = params.username;

  const post = await Post.findById(postId);
  if (!post) notFound();

  /**
   * /mails/nickname/234 에서 아이디와 해당 post의 주인이 같은때만 허용.
   * postId 무작위 대입을 막기위해 있습니다.
   */
  if (post.user.username != username) notFound();

  // 공개글이면 이동
  if (post.isPublic) return <View postId={postId} writer />;


  // 비공개 글이면 주인 확인
  const password = post.password;
  const cookieStore = cookies();
  const pwcookie = cookieStore.get("password");

  if (pwcookie && pwcookie.value == password)
    return <View postId={postId} writer />;

   // 로그인 페이지 이동!
  const callbackUrl = `https://${process.env.DOMAIN}/mails/${username}/${postId}`;
  redirect(`/mails/${username}/${postId}/signin?&callbackUrl=${callbackUrl}`)
}
