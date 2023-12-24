import airForceTime from "./time";
import styles from "./mail.module.css";
import { getUser } from "./server/getUser";

export async function Header(params) {
  let user = await getUser(params.username);

  console.log(user);

  let name = user.name;
  let [start, end] = airForceTime(user.generation);
  let substring = user.substring;
  return (
    <>
      <div className="text-4xl">dsadsadsa</div>
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
    </>
  );
}
