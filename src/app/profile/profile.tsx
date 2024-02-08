import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getProfile, deleteUser } from "./server";
import { useEffect, useRef } from "react";
import styles from "./page.module.css";

type profile = {
  id: number;
  username: string;
  password: string;
  name: string;
  birth: string;
  generation: number;
  message: string;
  memberSeq: string | null;
  sodae: string | null;
  connect: boolean;
};
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

  const user = useRef({
    id: 0,
    username: "string",
    password: "string",
    name: "string",
    birth: "string",
    generation: 0,
    message: "string",
    connect: false,
  });

  async function del() {
    if (
      confirm("정말로 계정을 삭제하시겠습니까? 작성된 모든 편지가 사라집니다.")
    ) {
      alert("삭제되었습니다.");
      await deleteUser(user.current.username);
      signOut();
    } else {
    }
  }
  return (
    <>
      <div className={`screen ${styles.profile}`}>
        <div style={{ height: 24 }}></div>
        <h1 className="">내 정보</h1>
        <div style={{ height: 65 }}></div>
        <h2>{user.current.birth}</h2>
        <div style={{ height: 6 }}></div>
        <h2>{user.current.name}</h2>
        <div style={{ height: 6 }}></div>
        <h2>{user.current.message}</h2>
        <div style={{ flex: 1 }}></div>

        <button className="submit">정보 수정</button>
        <div style={{ height: 26 }}></div>
        <button className="submit">비밀번호 변경</button>
        <div style={{ height: 26 }}></div>
        <button className="submit" onClick={del}>
          회원 삭제
        </button>
        <div style={{ height: 36 }}></div>
      
      </div>
    </>
  );
}
