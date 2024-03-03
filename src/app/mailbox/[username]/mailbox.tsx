import styles from "./page.module.css";
import Link from "next/link";
import crypto from "crypto";
import { setCookie } from "./cookie";
import { Nav } from "src/components";
import { Post } from "src/db";
import { dateToStr } from "src/lib/time";

export async function Mailbox({ username }) {
  const posts = await Post.findByUsername(username);

  return <div className="screen">
    <div className={styles.box}>
      <div className="sized" style={{ height: 24 }}></div>

      <h2 className="text-2xl font-medium">받은 편지 목록</h2>

      <div className="sized" style={{ height: 24 }}></div>
      {posts.map((post, index) => (
        <div key={post.id}>
          {index !== 0 && <div className="sized" style={{ height: 4 }}></div>}
          <Card
            title={post.title}
            name={post.name}
            rel={post.relationship}
            time={dateToStr(post.createdAt)}
          />
        </div>
      ))}
    </div>
  </div>;
}

function Card({title,name, rel, time}) {
  return (
    <div className={styles.card}>
      <p className="text-left text-lg">{title}</p>
      <div className="sized" style={{ height: 4 }}></div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <p>{`${name} | ${rel}`}</p>
        <div style={{ flex: 1 }}></div>
        <p>{time}</p>
      </div>
    </div>
  );
}