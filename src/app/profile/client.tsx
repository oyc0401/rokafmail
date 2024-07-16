"use client";
import { signOut } from "next-auth/react";
import { deleteUser, deleteUserGoogle } from "src/server/apiAction/profile";
import Link from "next/link";
import { action } from "src/lib/actionResponse";
import { useRouter } from "next/navigation";
import { sha256 } from "src/utils/sha256";
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
  const router = useRouter();

  async function onclickDelete() {
    if (
      confirm("정말로 계정을 삭제하시겠습니까? 작성된 모든 편지가 사라집니다.")
    ) {
      const pw = prompt("비밀번호를 입력해주세요.");
      if (pw) {
        const encryptedPassword = sha256(pw);

        try {
          await action(deleteUser(encryptedPassword));
          alert("삭제되었습니다.");
          signOut({ callbackUrl: "/" });
        } catch (error) {
          if (error.status == 401) {
            alert('로그인을 해주세요');
            router.replace('/profile');
          } else if (error.status == 404) {
            alert(error.message);
          } else {
            alert(`error: ${error.message}`);
          }
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

export function DeleteUserGoogle({ username }) {
  const router = useRouter();

  async function onclickDelete() {
    if (
      confirm("정말로 계정을 삭제하시겠습니까? 작성된 모든 편지가 사라집니다.")
    ) {
      try {
        await action(deleteUserGoogle());
        alert("삭제되었습니다.");
        signOut({ callbackUrl: "/" });
      } catch (error) {
        if (error.status == 401) {
          alert('로그인을 해주세요');
          router.replace('/profile');
        } else if (error.status == 404) {
          alert(error.message);
        } else {
          alert(`error: ${error.message}`);
        }
      }


    }
  }

  return (
    <button className='text-xs underline text-[#B3B3B3]' onClick={onclickDelete}>
      구글 회원삭제
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

        <DeleteUserGoogle username={username}></DeleteUserGoogle>
      </footer>
    </>
  )
}
