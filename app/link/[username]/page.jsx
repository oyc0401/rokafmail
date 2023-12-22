import styles from "./link.module.css";

export default async function Link({ params }) {
  return (
    <>
      <div
        style={{
          display: "flex",
          height: "100%",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingLeft: "20px",
          paddingRight: "20px",
        }}
      >
        <div style={{ flex:151 }}></div>
        <span className={`material-symbols-outlined ${styles.icon}`}>
          check_circle
        </span>
        <div style={{ height: 28 }}></div>
        <h2 className={styles.title}>링크가 생성되었습니다!</h2>
        {/* <div>{`http://oyc0401.site/write/${params.username}`}</div> */}
      
        <div style={{ flex:188 }}></div>
        <h2 className={styles.subtitle}>
          링크를 공유하고
          <br />
          편지를 받으세요!
        </h2>
        <div style={{ height: 35 }}></div>
        <button className={"submit"}>링크 복사</button>
        <div style={{ height: 32 }}></div>
      </div>
    </>
  );
}
