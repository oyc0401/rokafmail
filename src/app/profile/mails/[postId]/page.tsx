import { notFound, redirect } from "next/navigation";
import Link from "next/link";

import { NavHeader } from 'src/components'
import { auth } from "src/auth";
import { getUserByUsername } from "src/server/apiSSR/user/server";
import { Paper } from "./paper";
import { getPostContent } from "src/server/apiSSR/mail/server";

export const metadata = {
  title: "하늘인편 | 편지 확인",
};

export default async function Page({ params }) {
  const postId = Number(params.postId);
  const post = await getPostContent(postId);
  if (!post) notFound();

  // 세션
  const session = await auth();
  if (!session || !session.user || !session.user.username)
    redirect("/auth/signin");

  const username = session.user.username;
  const user = await getUserByUsername(username);
  if (!user) notFound();


  return (
    <div className="w-full flex flex-col max-w-3xl mx-auto h-full">
      <NavHeader user={user}></NavHeader>
      <UserDescription writer={post.name}></UserDescription>
      <Paper post={post}></Paper>
      <div className="flex-1"></div>
      <footer className="container max-w-3xl mx-auto px-4">
        <div className="flex flex-row pt-2 sm:pt-3 pb-8">
          <Link className={"submit"} href={`/profile/mails`}>
            편지함
          </Link>
        </div>
      </footer>
    </div>
  );

}


async function UserDescription({ writer }) {

  return (
    <div role='userDescription' className="pt-3 pb-3.5 w-full px-4">
      <div className="flex flex-row">
        <h2 className={'text-[22px] font-medium text-left'}>
          <span className="text-primary">{writer}</span> 님이
          <br></br>
          전송한 편지
        </h2>

      </div>

    </div>
  );
}

