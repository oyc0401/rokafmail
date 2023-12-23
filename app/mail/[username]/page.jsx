import airForceTime from "./time";
import styles from "./mail.module.css";
import { getUser } from "./server/getUser";
import { Form } from "./form";

export default async function Mail({ params }) {
  let user = await getUser(params.username);

  console.log(user);

  let name = user.name;
  let [start, end] = airForceTime(user.generation);
  let substring = user.substring;

  

  return (
    <>
      <div
        style={{
          display: "flex",
          // height: "100%",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingLeft: "20px",
          paddingRight: "20px",
        }}
      >
        <div style={{ height: 17 }}></div>
        <h2 className={styles.title}>
          <span className={styles.highlight}>{name}</span> 훈련병에게
          <br />
          편지를 보내주세요!
        </h2>
        <div style={{ height: 1 }}></div>
        <h2 className={styles.subtitle}>
          {start} ~ {end}
        </h2>
        <div style={{ height: 10 }}></div>
        <h2 className={styles.subtext}>{substring}</h2>
        <div style={{ height: 30 }}></div>
        <Form username={params.username}></Form>
      </div>
    </>
  );
}
