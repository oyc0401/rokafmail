import Link from "next/link";
import { notFound } from "next/navigation";

import { NavHeader } from "src/components";
import { minuteToStr, postMailDMinute } from "src/lib/time";
import { getPostedPosts, getNotPostedPosts, getNotAuthPosts } from "src/app/apiSSR/mails/server";
import { getUserByUsername } from "src/app/apiSSR/user/server";
import { LetterList } from "./LetterList";
import { TabBar } from "./TabBar";
import { UnpostedLetterPage } from "./UnpostedLetterPage";
import { getUnpostedLetters } from "src/app/apiAction/mails/getNotAuthPost";
import { action } from "src/app/apiSSR/actionResponse";


export const metadata = {
  title: "하늘인편 | 받은 편지함",
};

export default async function Mails({ params, searchParams }) {
  const username = decodeURI(params.username);

  const user = await getUserByUsername(username);
  if (!user) notFound();

  const pageState = searchParams.page;

  let content = <></>;

  if (!user.connect) {
    content = <BeforeLetter user={user} />
  } else if (pageState == 'wait') {
    content = <WaitLetter user={user} />
  } else {
    content = <CompleteLetter user={user} />
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


async function BeforeLetter({ user }) {
  const letters = await action(getUnpostedLetters(user.username, 1, 10));
  return (
    <>
      <TimeIndicator generation={user.generation} />
      <UnpostedLetterPage user={user} initialData={letters} />
    </>
  )
}



async function CompleteLetter({ user }) {
  const letters = await getPostedPosts(user.username);
  return (
    <>
      <TabBar username={user.username} active={0}></TabBar>
      <LetterList letters={letters} emptyMessage='받은 편지가 없습니다.'></LetterList>
    </>
  );
}

async function WaitLetter({ user }) {
  const letters = await getNotPostedPosts(user.username);
  return (
    <>
      <TabBar username={user.username} active={1}></TabBar>
      <LetterList letters={letters} emptyMessage='모든 편지가 보내졌습니다.'></LetterList>
    </>
  );
}

function TimeIndicator({ generation }) {
  const minute = postMailDMinute(generation);
  const strDate = minuteToStr(minute);
  if (strDate == "0분") {
    return <></>;
  }
  return <p className="pt-2">{strDate}뒤에 편지가 전달됩니다</p>;
}

