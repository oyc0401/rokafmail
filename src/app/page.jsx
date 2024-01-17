import styles from "./main.module.css";
import Link from "next/link";

import { Logo, LogoTitle } from "public/assets/index";
import Image from "next/image";
export default function Register() {
  return (
    <div className="screen">
      <div style={{ flex: 90 }}></div>

      <div className="p-5">
        <Image className={styles.logo} src={Logo} alt="로고" />
        <div style={{paddingTop:38}}>
          <Image className={styles.logoTitle} src={LogoTitle} alt="로고" />
        </div>
      </div>

      <div style={{ flex: 130 }}></div>

     

      <div className="pt-1 pb-4 w-full">
        <h3 className={styles.substring}>
          입대전에 공군 인편 링크를
          <br />
          만들고 공유하세요!
        </h3>
      </div>

      <div style={{ flex: 16 }}></div>

      <Link className="submit" href={{ pathname: "/register" }}>
       시작하기
      </Link>
      <div className="pt-2.5 pb-5 w-full">
        <Link href="/search" className={styles.help}>
          편지함 찾기
        </Link>
      </div>
    </div>
  );
}
