
import { Post, User } from "src/db";
import { notFound, redirect } from "next/navigation";

import { NavHeader } from 'src/components/NavHeader'
import { Submit } from './submit'

// import { dateToStr } from "./dateToStr";
import {
  getEnter,
  getCompletion,
} from "src/lib/time";
import { cookies } from "next/headers";
import { Paper } from "./paper";

export default async function EditPage({ params }) {
  const postId = Number(params.postId);
  const username = params.username;

  const post = await Post.findById(postId);
  if (!post) notFound();

  const user = await User.findByUsername(username);
  if (!user) notFound();

  const password = post.password;
  const cookieStore = cookies();
  const pwcookie = cookieStore.get("password");

  const { title, contents, name, relationship, posted } = post;
  const props = { title, contents, name, relationship };

  const url = `https://www.airforce.mil.kr/user/indexSub.action?codyMenuSeq=156893223&siteId=last2&menuUIType=top&dum=dum&command2=getEmailList&searchName=${user.name}&searchBirth=${user.birth}&memberSeq=${user.memberSeq}`;

  if (pwcookie && pwcookie.value == password)
    return <div className="h-full flex flex-col max-w-3xl mx-auto">
      <NavHeader user={user}></NavHeader>
      <UserDescription user={user}></UserDescription>
      <Paper updateProps={props}></Paper>
      <div className="flex-1"></div>
      <Submit postId={postId} username={username} posted={posted} url={url}></Submit>
    </div>;


  redirect(`/mails/${username}/${postId}`)
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
          <span className="text-primary">{name}</span> 훈련병
          <br />
          편지 수정하기
        </h2>
      </div>
    </div>
  );
}
