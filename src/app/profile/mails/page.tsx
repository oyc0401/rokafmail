import { auth } from "src/auth";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { NavHeader } from "src/components";
import { LetterList } from "./LetterList";
import { getUserByUsername } from "src/server/apiSSR/user/server";
import { getMyPosts } from "src/server/apiSSR/profile/mails/server";

export const metadata = {
  title: "하늘인편 | 내가 받은 편지",
};


export default async function Mails() {
  const session = await auth();
  if (!session || !session.user || !session.user.username)
    redirect("/auth/signin");

  const username = session.user.username;
  const user = await getUserByUsername(username);

  if (!user) notFound();

  const letters = await getMyPosts(username);

  return (
    <>
      <div className="h-full max-w-3xl mx-auto">
        <NavHeader user={user}></NavHeader>
        <p className="text-lg font-medium p-3">내가 받은 편지</p>
        <LetterList letters={letters} emptyMessage='받은 편지가 없습니다.'></LetterList>
        <div style={{ height: 108, minHeight: 108, width: 1 }}></div>
      </div>
      <nav className="fixed bottom-0 w-full">
        <footer className="container max-w-3xl mx-auto px-8">
          <div className="flex flex-row pt-3 pb-8">
            <Link className={"submit shadow-md"} href={`/profile`}>
              내 정보
            </Link>
          </div></footer>
      </nav>
    </>
  );
}

