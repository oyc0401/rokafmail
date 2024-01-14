import { CopyButton } from "./copy_button";

import Image from "next/image";

import styles from "./link.module.css";
import { CheckCircle } from "public/assets/index";

export default function LinkPage({ params }) {
  let domain = process.env.DOMAIN;
  let url = `https://${domain}/mail/${params.username}`;

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
      <CopyButton url={url}></CopyButton>
      <div style={{ height: 32 }}></div>
    </div>
  );
}
