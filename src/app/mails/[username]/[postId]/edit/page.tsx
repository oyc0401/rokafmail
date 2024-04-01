import styles from "./page.module.css";
import Link from "next/link";
import crypto from "crypto";
import { Nav } from "src/components";
import { Post, User } from "src/db";
import { notFound, redirect } from "next/navigation";

import { NavHeader } from 'src/components/NavHeader'
import{Submit} from './submit'

// import { dateToStr } from "./dateToStr";
import {
  getEnter,
  getCompletion,
  knowTime,
  Status,
  serveStatus,
} from "src/lib/time";
import { cookies } from "next/headers";
import { Paper } from "./paper";

export default async function EditPage({ params }) {
  const postId = Number(params.postId);
  const username = params.username;

  const post = await Post.findById(postId);
  if (!post) notFound();

  const user = await User.findByUsername(username);


  const password = post.password;
  const cookieStore = cookies();
  const pwcookie = cookieStore.get("password");

  const { title, contents, name, relationship } = post;
  const props = { title, contents, name, relationship };


  if (pwcookie && pwcookie.value == password)
    return <div className="h-full flex flex-col">
      <UserDescription user={user}></UserDescription>
      <Paper updateProps={props}></Paper>
      <div className="flex-1"></div>
      <Submit username={username}></Submit>
    </div>;


  redirect(`/mails/${username}/postId`)
}

async function UserDescription({ user }) {
  const { name, message, generation, username } = user;

  const startTime = getEnter(generation).format("YY.MM.DD");
  const compTime = getCompletion(generation).format("YY.MM.DD");

  const domain = process.env.DOMAIN;
  const url = `https://${domain}/mail/${username}`;

  return (
    <div role='userDescription' className="pt-3 pb-3.5 w-full px-4">
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "start",
        }}
      >
        <h2 className={'text-[22px] font-medium text-left'}>
          <span className="text-primary">{name}</span> 훈련병에게
          <br />
          편지를 보내주세요!
        </h2>
      </div>

      <div className="pt-px w-full">
        <h2 className='text-sm font-medium text-left text-fontlight'>
          {startTime} ~ {compTime}
        </h2>
      </div>
      <div className="pt-2 w-full">
        <h2 className='text-medium text-left'>{message}</h2>
      </div>
    </div>
  );
}
