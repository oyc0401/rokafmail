
import Link from "next/link";

import { notFound } from "next/navigation";
import { Paper } from "./paper";

import { NavHeader } from 'src/components'
import { getPublicPostById } from "src/app/apiSSR/mails/server";
import { getUserById } from "src/app/apiSSR/user/server";

export async function View({ postId, writer }: { postId: number; writer?: boolean }) {
  const post = await getPublicPostById(postId);
  if (!post) notFound();


  const user = await getUserById(post.userId);
  if (!user) notFound();

  return (
    <div className="w-full flex flex-col max-w-3xl mx-auto h-full">
      <NavHeader user={user}></NavHeader>
      <UserDescription writer={post.name}></UserDescription>
      <Paper post={post}></Paper>
      <div className="flex-1"></div>
      <footer className="container max-w-3xl mx-auto px-4">
        <div className="row pt-2 sm:pt-3 pb-8">
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
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "start",
        }}
      >
        <h2 className={'text-[22px] font-medium text-left'}>
          <span className="text-primary">{writer}</span> 님이
          <br></br>
          전송한 편지
        </h2>

      </div>

    </div>
  );
}

