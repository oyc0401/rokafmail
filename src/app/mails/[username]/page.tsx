import Link from "next/link";
import { notFound } from "next/navigation";
import { NavHeader } from "src/components";
import { minuteToStr, postMailDMinute } from "src/lib/time";
import { getUnpostedLetters, getPostedLetters, getLetters } from "src/server/apiAction/mails/server";
import { action } from "src/lib/actionResponse";
import { getUserByUsername } from "src/server/apiSSR/user/server";
import { TabBar } from "./TabBar";
import { UnpostedLetterPage } from "./pages/UnpostedLetterPage";
import { PostedLetterPage } from "./pages/PostedLetterPage";
import { WaitLetterPage } from "./pages/WaitLetterPage";
import { getMilitaryRank } from "src/app/mail/[username]/page";

export const metadata = {
  title: "하늘인편 | 받은 편지함",
};

export default async function Mails({ params }) {
  const username = decodeURI(params.username);

  const user = await getUserByUsername(username);
  if (!user) notFound();

  return (
    <>
      <div className="h-full max-w-3xl mx-auto">
        <NavHeader user={user}></NavHeader>
        <Letters user={user} />
        <div style={{ height: 108, minHeight: 108, width: 1 }}></div>
      </div>
      <nav className="fixed bottom-0 w-full">
        <footer className="container max-w-3xl mx-auto px-8">
          <div className="flex flex-row pt-3 pb-8">
            <Link className={"submit shadow-md"} href={`/mail/${user.username}`}>
              편지 작성
            </Link>
          </div>
        </footer>
      </nav>
    </>
  );
}

async function Letters({ user }) {
  const letters = await action(getLetters(user.username, 1, 10));
  return (
    <>
      {/* <p className="text-xl text-left font-medium pt-5 px-6 pb-2">{user.name} {getMilitaryRank(user.generation)}의 편지</p> */}
      <PostedLetterPage user={user} initialData={letters} />
    </>
  );
}

function TimeIndicator({ generation }) {
  const minute = postMailDMinute(generation);
  const strDate = minuteToStr(minute);
  if (strDate == "0분") {
    return <></>;
  }
  return <p className=" text-sm pt-3 pb-1 text-[#AAAAAA]">{strDate} 후에 편지가 전달됩니다</p>;
}

