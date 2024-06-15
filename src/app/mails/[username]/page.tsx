import Link from "next/link";
import { Post, User } from "src/db";
import { notFound } from "next/navigation";
import { NavHeader } from "src/components";
import { LetterList } from "./LetterList";
import { TabBar } from "./TabBar";
import { minuteToStr, postMailDMinute, postMailDday } from "src/lib/time";

export const metadata = {
  title: "하늘인편 | 받은 편지함",
};

async function getPostedPosts(username) {
  const postsPrivate = await Post.findPrivateByUsername(username);
  const postsPublic = await Post.findPublicByUsername(username);
  const posts = [...postsPrivate, ...postsPublic];
  const postsSorted = posts.sort((a, b) => a.id > b.id ? -1 : 1);
  return postsSorted
}

async function getNotPostedPosts(username) {
  const queuePrivate = await Post.findPrivateNotPostedByUsername(username);
  const queuePublic = await Post.findPublicNotPostedByUsername(username);
  const queues = [...queuePrivate, ...queuePublic];
  const queueSorted = queues.sort((a, b) => a.id < b.id ? -1 : 1);
  return queueSorted;
}

async function getNotAuthPosts(username) {
  const queuePrivate = await Post.findPrivateNotPostedByUsername(username);
  const queuePublic = await Post.findPublicNotPostedByUsername(username);
  const queues = [...queuePrivate, ...queuePublic];
  const queueSorted = queues.sort((a, b) => a.id > b.id ? -1 : 1);
  return queueSorted;
}


export default async function Mails({ params, searchParams }) {
  const username = decodeURI(params.username);

  const user = await User.findByUsername(username);
  if (!user) notFound();

  const pageState = searchParams.page;

  let content = <></>;


  if (!user.connect) {
    const unposteds = await getNotAuthPosts(username);

    content = <>
      <TimeIndicator generation={user.generation}></TimeIndicator>
      <LetterList letters={unposteds} emptyMessage='받은 편지가 없습니다.'></LetterList>
    </>
  } else if (pageState == 'complete') {
    const letters = await getPostedPosts(username);
    content = (
      <>
        <TabBar username={username} active={0}></TabBar>
        <LetterList letters={letters} emptyMessage='받은 편지가 없습니다.'></LetterList>
      </>
    );
  } else if (pageState == 'wait') {
    const unposteds = await getNotPostedPosts(username);
    content = <>
      <TabBar username={username} active={1}></TabBar>
      <LetterList letters={unposteds} emptyMessage='모든 편지가 보내졌습니다.'></LetterList>
    </>
  } else {
    const letters = await getPostedPosts(username);
    content = (
      <>
        <TabBar username={username} active={0}></TabBar>
        <LetterList letters={letters} emptyMessage='받은 편지가 없습니다.'></LetterList>
      </>
    );
  }

  return (
    <>
      <div className="h-full max-w-3xl mx-auto">
        <NavHeader user={user}></NavHeader>
        {content}
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

function TimeIndicator({generation}) {
  const minute = postMailDMinute(generation);
  const strDate = minuteToStr(minute);
  if (strDate == "0분") {
    return <></>;
  }
  return <p className="pt-2">{strDate}뒤에 편지가 전달됩니다</p>;
}

