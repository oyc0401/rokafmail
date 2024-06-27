"use client";
import { signOut } from "next-auth/react";
import { deleteUser } from "src/app/apiAction/profile/action";
import crypto from "crypto";
import Link from "next/link";
export function SignOut() {
  async function onclickSignout() {
    if (confirm("로그아웃 하시겠습니까?")) {
      signOut({ callbackUrl: "/" });
    }
  }

  return (
    <button className='text-xs underline' onClick={onclickSignout}>
      로그아웃
    </button>
  );
}

export function DeleteUser({ username }) {
  async function onclickDelete() {
    if (
      confirm("정말로 계정을 삭제하시겠습니까? 작성된 모든 편지가 사라집니다.")
    ) {
      const pw = prompt("비밀번호를 입력해주세요.");
      if (pw) {
        const encryptedPassword = crypto
          .createHash("sha256")
          .update(pw)
          .digest("hex");

        const response = await deleteUser(username, encryptedPassword);
        if (response.message) {
          alert("삭제되었습니다.");
          signOut({ callbackUrl: "/" });
        } else {
          alert(`error: ${response.status} ${response.error}`);
        }
      }
    }
  }

  return (
    <button className='text-xs underline text-[#B3B3B3]' onClick={onclickDelete}>
      회원삭제
    </button>
  );
}

export function Footer({ username }) {
  return (
    <>
      <footer className="bg-[#F5F5F5] w-full px-4 pt-3 pb-4 flex flex-col items-start">
        <Link className='text-xs underline' href={"/profile/editPassword"}>비밀번호 변경</Link>
        <div className="flex flex-row w-full justify-between pt-2">
          <SignOut />
          <DeleteUser username={username} />
        </div>
      </footer>
    </>
  )
}
