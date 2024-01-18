import Link from "next/link";
import styles from "./style.module.css";

export default function Help() {
  return (
    <>
      <div className="screen">
        <div style={{ padding: "56px 0" }}>
          <h1 className={styles.title}>하늘인편이란?</h1>
        </div>

        <h2 className={styles.content}>
          공군 인터넷 편지 링크를 미리 만들어 공유할 수 있는 사이트입니다.
          <br /> <br />
          입대 2주후부터 작성할 수 있는 기존 인터넷편지 사이트와 달리,
          <span className={styles.blue}> 하늘인편</span>을 활용하면 입대 이후에
          바로 편지쓰기가 가능합니다. 2주 이전에 작성한 편지는 2주후에
          보내집니다. <br /> <br />
          수료 후 편지함을 열어 받은 편지를 다시 볼 수 있습니다
        </h2>
        <div style={{ flex: 1 }}></div>

        <div style={{ paddingBottom: 32, width: "100%" }}>
          <Link className="submit" href={{ pathname: "/register" }}>
            시작하기
          </Link>
        </div>
      </div>
    </>
  );
}
