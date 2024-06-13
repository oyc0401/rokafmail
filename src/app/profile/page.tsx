import { auth } from "src/app/api/auth/auth";
import { User } from "src/db";

import { redirect } from "next/navigation";
import Link from "next/link";
import { DeleteUser, SignOut } from "./client";
import { NavHeader } from "src/components";
import { Edit } from "public/assets";
import Image from "next/image";
import styles from "./page.module.css";
export const metadata = {
  title: "하늘인편 | 내 정보",
};

export default async function Page() {
  const session = await auth();
  if (!session || !session.user || !session.user.email)
    redirect("/auth/signin");

  const username = session.user.email;
  const user = await User.findByUsername(username);
  if (!user) redirect("/auth/signin");



  const { name, birth, generation, message, memberSeq, sodae, connect } = user;

  function Sodae() {
    if (sodae) {
      return (
        <div className="flex flex-row w-full bg-[#F5F5F5]">
          <div className="w-full">
            <h2 className="text-base text-primary font-normal text-left pb-[1px]">소대번호</h2>
            <p className="text-lg text-primary font-normal text-left pb-4">{sodae}</p>
          </div>
        </div>
      );
    }
    
    return <></>
  }
  return (
    <>
      <div className={`max-w-3xl mx-auto h-full flex flex-col`}>
        <NavHeader user={{ username, name, birth, memberSeq, connect }}></NavHeader>
        <div className="flex-1 flex flex-col w-full">
          <h1 className="text-2xl font-medium pt-6 pb-8">내 정보</h1>
          <div className="flex flex-col w-full pt-4 px-4 bg-[#F5F5F5]">
            <div className="flex flex-row w-full bg-[#F5F5F5]">
              <ProfileArea title="아이디" text={username} />
              <ProfileArea title="기수" text={generation} />
            </div>
            <Sodae />
          </div>
          <div className="flex flex-row w-full pt-4 px-4">
            <ProfileArea title="이름" text={name} />
            <div className="w-full">
              <div className="flex flex-row justify-between">
                <h2 className="text-base font-normal text-left pb-[1px]">생년월일</h2>
                <Link className='text-base underline whitespace-nowrap' href={"/profile/edit"}>
                  <Image className={styles.icon} src={Edit} alt="로고" />
                </Link>
              </div>
              <p className="text-lg font-normal text-left pb-4">{birth}</p>
            </div>
          </div>
          <div className="flex flex-row w-full px-4">
            <ProfileArea title="한줄 글" text={message} />
          </div>
          <div className="px-4">
            <div style={{ height: 1, width: "100%", background: "var(--primary)" }}></div>
          </div>
          <div className="pt-4 px-12">
            <div className="pt-4">
              <Link className="w-full inline-block p-2 bg-primary rounded text-white text-lg shadow"
                href={{ pathname: `/mail/${username}` }}>내 편지함</Link>
            </div>
            <div className="pt-4">
              <Link className="w-full inline-block p-2 bg-[#FFFDF8] rounded text-black text-lg shadow"
                href={{ pathname: `/profile/mails` }}>받은 편지 열기</Link>
            </div>
          </div>

          <div style={{ flex: 1 }}></div>

          <div className="pt-8">
            <Link className='text-base underline' href={"/profile/editPassword"}>비밀번호 변경</Link>
          </div>
          <div className="pt-3"> <SignOut /> </div>
          <div className="py-8"> <DeleteUser username={username} /> </div>

        </div>

      </div>
    </>

  );
}

function ProfileArea({ title, text }) {
  return (
    <>
      <div className="w-full">
        <h2 className="text-base font-normal text-left pb-[1px]">{title}</h2>
        <p className="text-lg font-normal text-left pb-4">{text}</p>
      </div>
    </>
  );
}
