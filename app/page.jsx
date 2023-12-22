import styles from "./main.module.css";
import Link from "next/link";

import Logo from "./assets/logo.png";
import Image from "next/image";

export default function Register() {
  return (
    <>
      <div className="screen">
        <div style={{ flex: 80 }}></div>
        <Image
          src={Logo}
          alt="로고"
          style={{ width: "171px", height: "171px" }}
        />
        <div style={{ flex: 146 }}></div>
        <h1 className={styles.title}>공군 인편지기</h1>
        <div style={{ height: 13 }}></div>
        <h3 className={styles.substring}>
          {" "}
          입대전에 인편 링크를
          <br />{" "}
        </h3>
        <h3 className={styles.substring}> 만들고 공유하세요!</h3>

        <div style={{ flex: 69 }}></div>
        <Link className="submit" href={{ pathname: "/register" }}>
          시작하기
        </Link>
        <div style={{ height: 11 }}></div>
        <div className={styles.help}>도움말</div>
        <div style={{ height: 19 }}></div>
      </div>
    </>
  );
}
