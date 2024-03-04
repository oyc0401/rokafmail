import { CopyButton } from "./copy_button";

import Image from "next/image";

import styles from "./link.module.css";
import { CheckCircle } from "public/assets/index";
import { User } from "src/db";
import { notFound } from "next/navigation";

export default async function LinkPage({ params }) {
   const username = decodeURI(params.username);

  const user = await User.findByUsername(username);
  if (!user) {
    notFound();
  }

  const domain = process.env.DOMAIN;
  const url = `https://${domain}/mail/${username}`;

  const {name, generation} = user;

  return (
    <div className="screen">
      <div style={{ flex: 151 }}></div>
      <Image className={styles.icon} src={CheckCircle} alt="아이콘" />
      <div style={{ height: 28 }}></div>
      <h2 className={styles.title}>링크가 생성되었습니다!</h2>
      <div style={{ flex: 185 }}></div>
      <h2 className={styles.subtitle}>
        링크를 공유하고
        <br />
        편지를 받으세요!
      </h2>
      <div style={{ height: 36 }}></div>
      <CopyButton url={url} name={name} generation={generation}></CopyButton>
      <div style={{ height: 32 }}></div>
    </div>
  );
}
