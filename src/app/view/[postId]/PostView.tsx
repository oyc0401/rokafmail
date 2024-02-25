import styles from "./page.module.css";
import Link from "next/link";
import crypto from "crypto";
import { setCookie } from "./cookie";
import { Nav } from "src/components";
import { Post, User } from "src/db";
import { notFound } from "next/navigation";
import { Paper } from "./paper";
import { Footer } from "./Footer";
// import { dateToStr } from "./dateToStr";
import {
  getEnter,
  getCompletion,
  knowTime,
  Status,
  serveStatus,
} from "src/lib/time";

export async function PostView({ postId }) {
  const post = await Post.findById(postId);
  if (!post) {
    notFound();
  }

  const user = await User.findById(post.userId);
  if (!user) {
    notFound();
  }

  
  
  return (
    <div className="screen">
      <Header user={user}></Header>
      <Paper post={post}></Paper>

      <div style={{ height: 12 }}></div>
      <Footer postId={postId} username={user.username} posted={post.posted} url={`https://www.airforce.mil.kr/user/indexSub.action?codyMenuSeq=156893223&siteId=last2&menuUIType=top&dum=dum&command2=getEmailList&searchName=${user.name}&searchBirth=${user.birth}&memberSeq=${user.memberSeq}`}></Footer>
    </div>
  );
}

async function Header({ user }) {
  // console.log(user);
  const { name, message, generation, username } = user;

  const startTime = getEnter(generation).format("YY.MM.DD");
  const compTime = getCompletion(generation).format("YY.MM.DD");

  const domain = process.env.DOMAIN;
  const url = `https://${domain}/mail/${username}`;

  return (
    <div className="pt-4 pb-3.5 w-full">
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "start",
        }}
      >
        <h2 className={styles.title}>
          <span className="text-primary">{name}</span> 훈련병에게
          <br />
          보낸 편지 입니다.
        </h2>
        <div style={{ flex: 1 }}></div>
      </div>

      <div className="pt-px w-full">
        <h2 className={styles.time}>
          {startTime} ~ {compTime}
        </h2>
      </div>
      <div className="pt-2 w-full">
        <h2 className={styles.message}>{message}</h2>
      </div>
    </div>
  );
}


