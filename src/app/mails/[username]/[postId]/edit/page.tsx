import styles from "./page.module.css";
import Link from "next/link";
import crypto from "crypto";
import { Nav } from "src/components";
import { Post, User } from "src/db";
import { notFound, redirect } from "next/navigation";

import { NavHeader } from 'src/components/NavHeader'

// import { dateToStr } from "./dateToStr";
import {
  getEnter,
  getCompletion,
  knowTime,
  Status,
  serveStatus,
} from "src/lib/time";
import { cookies } from "next/headers";

export default async function EditPage({ params }) {
  const postId = Number(params.postId);
  const username = params.username;

  const post = await Post.findById(postId);
  if (!post)
    notFound();
  const password = post.password;
  const cookieStore = cookies();
  const pwcookie = cookieStore.get("password");

  if (pwcookie && pwcookie.value == password)
    return <>ㅇㄴㅁㅇㅁㅇ</>;


  redirect(`/mails/${username}/postId`)
}