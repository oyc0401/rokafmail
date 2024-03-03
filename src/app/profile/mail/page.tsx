
import { User } from "src/db";
import { notFound } from "next/navigation";
import { auth } from "src/app/api/auth/auth";

import styles from "./page.module.css";
import { Post } from "src/db";
import { dateToStr } from "src/lib/time";
export default async function Page() {
  const session = await auth();
  if (!session || !session.user || !session.user.email)  notFound();
  
  const username = session.user.email;
  const user = await User.findByUsername(username);
  if (!user)  notFound();

  

  const { name, birth, message } = user;

  return <Mailbox username={username}></Mailbox>;
}

async function Mailbox({ username }) {
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