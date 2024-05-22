import { auth } from "src/app/api/auth/auth";
import { User } from "src/db";

import { redirect } from "next/navigation";
import Link from "next/link";
import { DeleteUser, SignOut } from "./client";
import { NavHeader } from "src/components";

export default async function Page() {
  const session = await auth();
  if (!session || !session.user || !session.user.email)
    redirect("/auth/signin");

  const username = session.user.email;
  const user = await User.findByUsername(username);
  if (!user) redirect("/auth/signin");

  const { name, birth, generation, message, memberSeq, connect } = user;
  return (
    <>
      <div className={`max-w-3xl mx-auto h-full flex flex-col`}>
        <NavHeader user={{ username, name, birth, memberSeq, connect }}></NavHeader>
        <div className="flex-1 flex flex-col px-4">

          <h1 className="text-2xl font-medium pt-6 pb-12">내 정보</h1>
          <ProfileArea title="아이디" text={username} />

          <div
            style={{ height: 1, width: "100%", background: "var(--primary)" }}
          ></div>
          <div style={{ height: 20 }}></div>
          <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
            <ProfileArea title="기수" text={generation} />
            <Link className='text-base underline whitespace-nowrap' href={"/profile/edit"}>
              정보수정
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
            <ProfileArea title="이름" text={name} />
            <ProfileArea title="생년월일" text={birth} />
          </div>

          <ProfileArea title="한줄 글" text={message} />
          <div style={{ height: 20 }}></div>
          <Link className="submit" href={{ pathname: `/mail/${username}` }}>
            내 편지함
          </Link>
          <div style={{ flex: 1 }}></div>

          <div style={{ height: 26 }}></div>
          <Link className='text-base underline' href={"/profile/editPassword"}>
            비밀번호 변경
          </Link>

          <div style={{ height: 14 }}></div>

          <SignOut></SignOut>

          <div style={{ height: 36 }}></div>

          <DeleteUser username={username}></DeleteUser>
          <div style={{ height: 36 }}></div>

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
        <p className="text-lg font-normal text-left pb-5">{text}</p>
      </div>
    </>
  );
}
