"use client";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getProfile } from "./server";
import { useEffect, useRef } from "react";

export function Profile({ username }) {
  useEffect(() => {
    // 새로고침 막기(조건 부여 가능)
    console.log("dsad");
    init();
    return () => {};
  }, []);

  async function init() {
    const data = await getProfile(username);
    user.current = data!;
  }

  const user = useRef({birth:'dsa'});

  return (
    <>
      <div className="screen">
        {user.current.birth}
        {/* 내 프로필 <p>{user?.name}</p>


        <div>{`아이디: ${user?.username}`}</div>
 */}
      </div>
    </>
  );
}
