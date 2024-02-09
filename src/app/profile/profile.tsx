"use client";
import { signOut } from "next-auth/react";
import { deleteUser } from "./server";
import styles from "./page.module.css";
import Link from "next/link";

export function Profile({ username, name, birth, generation, message }) {
  async function onclickDelete() {
    if (
      confirm("정말로 계정을 삭제하시겠습니까? 작성된 모든 편지가 사라집니다.")
    ) {
      alert("삭제되었습니다.");
      await deleteUser(username);
      signOut();
    }
  }

  async function onclickSignout() {
    if (confirm("로그아웃 하시겠습니까?")) {
      signOut({callbackUrl: '/' });
    }
  }

  return (
    <>
      <div className={`screen ${styles.profile}`}>
        <div style={{ height: 24 }}></div>

        <h1>내 정보</h1>
        <div style={{ height: 65 }}></div>
         <ProfileArea title="아이디" text={username} />

        <div style={{height:1, width:'100%', background:'var(--primary)'}}></div>
        <div style={{height:20}}></div>
        <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
          <ProfileArea title="기수" text={generation} />
          <Link className={styles.editButton} href={"/profile/edit"}>
            정보수정
          </Link>
        </div>
      

        <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
          <ProfileArea title="이름" text={name} />
          <ProfileArea title="생년월일" text={birth} />
        </div>

        <ProfileArea title="한줄 글" text={message} />
         <div style={{height:20}}></div>
        <Link className="submit" href={{ pathname: `/mail/${username}` }}>
          내 편지함
        </Link>
        <div style={{ flex: 1 }}></div>

        <div style={{ height: 26 }}></div>
        <Link className={styles.textButton} href={"/profile/editPassword"}>
          비밀번호 변경
        </Link>

        <div style={{ height: 14 }}></div>

        <button className={styles.textButton} onClick={onclickSignout}>
          로그아웃
        </button>

        <div style={{ height: 36 }}></div>
        <button className={styles.delete} onClick={onclickDelete}>
          회원삭제
        </button>
        <div style={{ height: 36 }}></div>
      </div>
      <style jsx>{`
        h1 {
          width: 100%;
          color: var(--font-color);
          font-size: 24px;
          font-weight: 400;
          text-align: center;
          padding-bottom: 1px;
        }
      `}</style>
    </>
  );
}

function ProfileArea({ title, text }) {
  return (
    <>
      <div className="w-full">
        <h2>{title}</h2>

        <p>{text}</p>
      </div>
      <style jsx>{`
        h2 {
          width: 100%;
          color: var(--font-color);
          font-size: 16px;
          font-weight: 400;
          text-align: left;
          padding-bottom: 1px;
        }
        p {
          width: 100%;
          color: var(--font-color);
          font-size: 20px;
          font-weight: 400;
          text-align: left;
          padding-bottom: 20px;
        }
      `}</style>
    </>
  );
}
