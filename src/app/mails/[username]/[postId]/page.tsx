
import { Post, User } from "src/db";
import { notFound } from "next/navigation";
// import { Client } from "./client";
import { cookies } from "next/headers";
import { LoginPage } from "./loginPage";
import { PostView } from "./post/PostView";
import { View } from './view/view'

import { auth } from "src/app/api/auth/auth";
// import {Mailbox} from './mailbox'

export default async function Page({ params }) {
  const postId = Number(params.postId);
  const username = params.username;

  const post = await Post.findById(postId);
  if (!post)
    notFound();


  if (post.user.username != username)
    notFound();


  // 세션
  const session = await auth();
  if (session && session.user && session.user.email) {
    const sessionUsername = session.user.email;
    const user = await User.findByUsername(sessionUsername);
    if (user && sessionUsername == params.username)
      return <View postId={postId} />;

  }

  // 쿠키
  const password = post.password;
  const cookieStore = cookies();
  const pwcookie = cookieStore.get("password");

  if (pwcookie == null)
    return <LoginPage postId={postId} />;


  if (pwcookie.value == password)
    return <View postId={postId} writer />;


  console.log("다른사람으로 로그인 되어있음");
  return <LoginPage postId={postId} />;
}
