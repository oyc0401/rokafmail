import { auth } from "src/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

import { DeleteUser, Footer, SignOut } from "./client";
import { NavHeader } from "src/components";
import { Edit } from "public/assets";
import Image from "next/image";
import styles from "./page.module.css";
import { getUserByUsername } from "src/server/apiSSR/user/server";
import { LinkButton } from "src/components/LinkButton";

export const metadata = {
  title: "하늘인편 | 내 정보",
};

export default async function Page() {
  const session = await auth();
  if (!session?.user.username)
    redirect("/auth/signin");

  const username = session.user.username;
  const user = await getUserByUsername(username);
  if (!user) redirect("/auth/signin");

  const domain = process.env.DOMAIN;
  const url = `https://${domain}/mail/${username}`;

  const { name, birth, generation, message, memberSeq, sodae, connect } = user;

  function Sodae() {
    if (sodae) {
      return (
        <div className="flex flex-row w-full">
          <div className="w-full">
            <h2 className="text-sm text-primary font-normal text-left pb-[1px]">소대번호</h2>
            <p className="text-base text-primary font-normal text-left pb-3">{sodae}</p>
          </div>
        </div>
      );
    }

    return <></>
  }
  return (
    <>
      <div className={`max-w-3xl mx-auto h-full flex flex-col`}>
        <NavHeader user={{ username }}></NavHeader>
        <div className="flex-1 flex flex-col w-full">
          <h1 className="text-2xl font-medium pt-6 pb-8">내 정보</h1>
          <div className="flex flex-col w-full pt-4 px-4">
            <div className="flex flex-row w-full">
              <ProfileArea title="아이디" text={username} />
              <ProfileArea title="기수" text={generation} />
            </div>
            <Sodae />
            <div className="flex flex-row w-full">
              <ProfileArea title="이름" text={name} />
              <div className="w-full">
                <div className="flex flex-row justify-between">
                  <h2 className="text-sm font-normal text-left pb-[1px]">생년월일</h2>
                  <Link href={"/profile/edit"}>
                    <Image className={styles.icon} src={Edit} alt="로고" />
                  </Link>
                </div>
                <p className="text-base font-normal text-left pb-3">{birth}</p>
              </div>
            </div>
            <ProfileArea title="한줄 글" text={message} />
          </div>
          <div className="px-4 pt-8">
            <LinkButton url={url}></LinkButton>
          </div>
          <div className="pt-6 px-4">
            <Link className="submit smallText shadow w-full"
              href='/profile/mails'>받은 편지 열기</Link>
          </div>

          <div style={{ flex: 1 }}></div>
          <Footer username={username} provider={session.user.provider} />
        </div>

      </div>
    </>

  );
}

function ProfileArea({ title, text }) {
  return (
    <>
      <div className="w-full">
        <h2 className="text-sm font-normal text-left pb-[1px]">{title}</h2>
        <p className="text-base font-normal text-left pb-3">{text}</p>
      </div>
    </>
  );
}
