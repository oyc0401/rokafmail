"use client";
import styles from "./page.module.css";
import { Mail } from "public/assets/index";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface userInfo {
  id: number;
  username: string;
  name: string;
  birth: string;
  generation: number;
  posts: Array<any>;
}

export function List({ users }: { users: Array<userInfo> }) {
  if (users.length == 0) {
    return "해당유저가 없습니다.";
  }

  const user = users[0];
  return (
    <div className="screen">
      <h1 className={styles.listTitle}>이동할 편지함 선택</h1>
      {users.map((user, index) => (
        <Card
          username={user.username}
          name={user.name}
          generation={user.generation}
          mailCount={user.posts.length}
        />
    ))}
    </div>
  );
}

function Card({ username, name, generation, mailCount }) {
  const router = useRouter();

  function click() {
    router.push(`/mail/${username}`);
  }
  return (
    <>
      <div className={styles.card} onClick={click}>
        <h1>{username}</h1>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <h2>
            {name} | {generation}
          </h2>
          <div style={{ flex: 1 }}></div>
          <Image className={styles.icon} src={Mail} alt="" />
          <h2>{mailCount}</h2>
        </div>
      </div>
    </>
  );
}
