"use client";
import { signOut } from "next-auth/react";
import { deleteUser } from "src/app/api/profile/profile";
import crypto from "crypto";
export function SignOut() {
  async function onclickSignout() {
    if (confirm("로그아웃 하시겠습니까?")) {
      signOut({ callbackUrl: "/" });
    }
  }

  return (
    <button className='text-base underline' onClick={onclickSignout}>
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
    <button className='text-base underline text-[#E6E6E6]' onClick={onclickDelete}>
      회원삭제
    </button>
  );
}
