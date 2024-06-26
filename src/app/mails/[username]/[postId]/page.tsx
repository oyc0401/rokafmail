import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";

import { View } from './view'
import { getPostView } from "src/app/apiSSR/mail/server";

export const metadata = {
  title: "하늘인편 | 편지 확인",
};

export default async function Page({ params }) {
  const postId = Number(params.postId);
  const username = params.username;

  const post = await getPostView(postId, username);

  // 편지가 넘어오면 인증 절차 다 끝낸거임
  if (post) {
    return <View postId={postId} writer />;
  }

  // 로그인 페이지 이동!
  const callbackUrl = `https://${process.env.DOMAIN}/mails/${username}/${postId}`;
  redirect(`/mails/${username}/${postId}/signin?&callbackUrl=${callbackUrl}`)
}
