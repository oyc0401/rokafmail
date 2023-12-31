"use client";
import styles from "./link.module.css";

export default function Link({ params }) {
  function copy() {
    let local = "https://airforce-mail--oyc0401.repl.co";
    let production = "https://oyc0401.site";

    let url = `${production}/mail/${params.username}`;
    // url = `${local}/mail/${params.username}`;
    
    navigator.clipboard.writeText(url);
    alert("복사되었습니다!");
  }

  return (
    <>
      <div className="screen">
        <div style={{ flex: 151 }}></div>
        <span className={`material-symbols-outlined md-128`}>check_circle</span>
        <div style={{ height: 28 }}></div>
        <h2 className={styles.title}>링크가 생성되었습니다!</h2>
        <div style={{ flex: 185 }}></div>
        <h2 className={styles.subtitle}>
          링크를 공유하고
          <br />
          편지를 받으세요!
        </h2>
        <div style={{ height: 36 }}></div>
        <button className={"submit"} onClick={copy}>
          링크 복사
        </button>
        <div style={{ height: 32 }}></div>
      </div>
    </>
  );
}
