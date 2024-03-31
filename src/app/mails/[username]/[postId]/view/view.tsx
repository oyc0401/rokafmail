import styles from "./page.module.css";
import Link from "next/link";
import crypto from "crypto";
import { Nav } from "src/components";
import { Post, User } from "src/db";
import { notFound } from "next/navigation";
import { Paper } from "./paper";

import { NavHeader } from 'src/components/NavHeader'

// import { dateToStr } from "./dateToStr";
import {
  getEnter,
  getCompletion,
  knowTime,
  Status,
  serveStatus,
} from "src/lib/time";

export async function View({ postId,writer }) {
  const post = await Post.findById(postId);
  if (!post) {
    notFound();
  }

  const user = await User.findById(post.userId);
  if (!user) {
    notFound();
  }


  return (
    <div className="w-full flex flex-col max-w-3xl mx-auto h-full">
      <NavHeader user={user}></NavHeader>
      <UserDescription user={user}></UserDescription>
      <Paper post={post}></Paper>
      {writer?'수정 가능!':<></>}
      <div className="flex-1"></div>
      <footer className="container max-w-3xl mx-auto px-4">
        <div className="row pt-2 sm:pt-3 pb-8">
          <Link className={"submit"} href={`/mails/${user.username}`}>
            편지함
          </Link>
        </div>
      </footer>
    </div>
  );
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
          <br></br>
          전송한 편지
        </h2>
        <div style={{ flex: 1 }}></div>
      </div>

    </div>
  );
}

