import Link from "next/link";
import { Post, PostQueue, UnconnectedPost, User } from "src/db";
import { notFound } from "next/navigation";
import { NavHeader } from "src/components/NavHeader";
import { Content, UnConnectedContent } from "./Content";

export async function generateMetadata(
  { params }
) {
  const username = decodeURI(params.username);
  return {
    title: `하늘인편 - ${username}`,
  }
}

export default async function Mails({ params }) {
  const username = decodeURI(params.username);

  let user = await User.findByUsername(username);
  if (!user) notFound();


  const postsPrivate = await Post.findPrivateByUsername(username);
  const postsPublic = await Post.findPublicByUsername(username);
  const posts = [...postsPrivate, ...postsPublic];
  const postsSorted = posts.sort((a, b) => a.id > b.id ? -1 : 1);

  let queuePrivate = await Post.findPrivateNotPostedByUsername(username);
  let queuePublic = await Post.findPublicNotPostedByUsername(username);
  const queues = [...queuePrivate, ...queuePublic];
  const queueSorted = queues.sort((a, b) => a.id < b.id ? -1 : 1);
  return (
    <>
      <div className="h-full max-w-3xl mx-auto">
        <NavHeader user={user}></NavHeader>
        {user.connect ? <Content mails={postsSorted} unpostMails={queueSorted}></Content>
          : <UnConnectedContent mails={queueSorted} ></UnConnectedContent>}
        <div style={{ height: 108, minHeight: 108, width: 1 }}></div>
      </div>
      <nav className="fixed bottom-0 w-full">
        <footer className="container max-w-3xl mx-auto px-8">
          <div className="row pt-3 pb-8">
            <Link className={"submit shadow-md"} href={`/mail/${user.username}`}>
              편지 작성
            </Link>
          </div></footer>
      </nav>
    </>
  );
}

