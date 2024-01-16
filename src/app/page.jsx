import styles from "./main.module.css";
import Link from "next/link";

import {Logo} from "public/assets/index";
import Image from "next/image";
export default function Register() {

  return (
    <div className="screen">
      <div style={{ flex: 62 }}></div>

      <div className="p-5">
        <Image className={styles.logo} src={Logo} alt="로고" />
      </div>

      <div style={{ flex: 116 }}></div>

      <div className="py-2 w-full">
        <h1 className={styles.title}>공군 인편지기</h1>
      </div>

      <div className="pt-1 pb-4 w-full">
        <h3 className={styles.substring}>
          입대전에 인편 링크를
          <br />
          만들고 공유하세요!
        </h3>
      </div>

      <div style={{ flex: 61 }}></div>

      <Link className="submit" href={{ pathname: "/register" }}>
        편지함 만들기
      </Link>
      <div className="pt-2.5 pb-5 w-full">
        <Link href='/search' className={styles.help}>편지함 찾기</Link>
      </div>
    </div>
  );
}
