import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";

import { NavHeader } from 'src/components'
import { getUserByUsername } from "src/server/apiSSR/user/server";
import { Paper } from "./paper";
import { Submit } from './submit'
import { getPostEverything } from "src/server/apiSSR/mail/server";

async function getPostAuthCheck(postId) {
  const post = await getPostEverything(postId);
  if (!post) notFound();

  const password = post.password;
  const cookieStore = cookies();
  const pwcookie = cookieStore.get("password");

  const { title, contents, name, relationship, posted, isPublic, images } = post;
  const props = { title, contents, name, relationship, isPublic, posted, images };

  if (pwcookie && pwcookie.value == password) {
    return props;
  }

  return null;
}

export const metadata = {
  title: "하늘인편 | 편지 수정",
};

export default async function EditPage({ params }) {
  const postId = Number(params.postId);
  const decodedUsername = decodeURI(params.username);

  const post = await getPostAuthCheck(postId);

  if (!post) {
    const callbackUrl = `https://${process.env.DOMAIN}/mails/${params.username}/${postId}/edit`;
    redirect(`/mails/${params.username}/${postId}/signin?callbackUrl=${callbackUrl}`)
  }

  const user = await getUserByUsername(decodedUsername);
  if (!user) notFound();

  const url = `https://www.airforce.mil.kr/user/indexSub.action?codyMenuSeq=156893223&siteId=last2&menuUIType=top&dum=dum&command2=getEmailList&searchName=${user.name}&searchBirth=${user.birth}&memberSeq=${user.memberSeq}`;

  return (
    <div className="h-full flex flex-col max-w-3xl mx-auto">
      <NavHeader user={user}></NavHeader>
      <UserDescription user={user}></UserDescription>
      <Paper updateProps={post}></Paper>
      <div className="flex-1"></div>
      <Submit postId={postId} username={decodedUsername} posted={post.posted} url={url}></Submit>
    </div>
  );
}

async function UserDescription({ user }) {
  const { name } = user;

  return (
    <div role='userDescription' className="pt-3 pb-3.5 w-full px-4">
      <div className="flex flex-row">
        <h2 className={'text-[22px] font-medium text-left'}>
          <span className="text-primary">{name}</span> 훈련병
          <br />
          편지 수정하기
        </h2>
      </div>
    </div>
  );
}
