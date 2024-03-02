import Link from "next/link";
import styles from "./page.module.css";
import { Post, User } from "src/db";
import { notFound } from "next/navigation";
// import { Client } from "./client";
import { cookies } from "next/headers";
import crypto from "crypto";
import { deleteCookie, setCookie } from "./cookie";
import { Client } from "./client";
import { PostView } from "./PostView";

// import {Mailbox} from './mailbox'

export default async function View({ params }) {
  const postId = Number(params.postId);
  const username = params.username;

  const post = await Post.findById(postId);
  if (!post) {
    notFound();
  }

  if (post.user.username != username) {
    notFound();
  }
  const password = post.password;

  const cookieStore = cookies();
  const pwcookie = cookieStore.get("password");

  if (pwcookie == null) {
    return <Client postId={postId} />;
  }

  if (pwcookie.value == password) {
    return <PostView postId={postId} />;
  }

  console.log("다른사람으로 로그인 되어있음");
  return <Client postId={postId} />;
}
