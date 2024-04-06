
import { Post, User } from "src/db";
import { notFound } from "next/navigation";
// import { Client } from "./client";
import { cookies } from "next/headers";
import { LoginPage } from "./loginPage";
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
    
    // 본인의 편지함
    if (user && sessionUsername == params.username)
      return <View postId={postId} />;
  }

  // 쿠키
  const password = post.password;
  const cookieStore = cookies();
  const pwcookie = cookieStore.get("password");

  if (pwcookie && pwcookie.value == password)
    return <View postId={postId} writer />;

  if (post.isPublic){
     return <View postId={postId} writer />;
  }

  return <LoginPage postId={postId} />;
}
