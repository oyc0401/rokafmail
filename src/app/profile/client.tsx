"use client";
import { signOut } from "next-auth/react";
import { deleteUser } from "./server";
import styles from "./page.module.css";

export function SignOut() {
  async function onclickSignout() {
    if (confirm("로그아웃 하시겠습니까?")) {
      signOut({ callbackUrl: "/" });
    }
  }

  return (
    <button className={styles.textButton} onClick={onclickSignout}>
      로그아웃
    </button>
  );
}


export function DeleteUser(username) {
  async function onclickDelete() {
    if (
      confirm("정말로 계정을 삭제하시겠습니까? 작성된 모든 편지가 사라집니다.")
    ) {
      alert("삭제되었습니다.");
      await deleteUser(username);
      signOut();
    }
  }

  return (
    <button className={styles.delete} onClick={onclickDelete}>
      회원삭제
    </button>
  );
}
