import styles from "./page.module.css";
import { Submit } from "./submit";
import { MakeBtn } from "./MakeBtn";
import { Paper } from "./paper";
import airForceTime from "./time";
import { getUser } from "../../server/getUser";
import { notFound } from "next/navigation";

export default async function Mail({ params }) {
  return (
    <>
      <Header username={params.username}></Header>
      <Paper></Paper>
      <MakeBtn></MakeBtn>
      <Submit username={params.username}></Submit>
    </>
  );
}

async function Header(params) {
  let user = await getUser(params.username);

  if (!user) {
    notFound();
  }
  // console.log(user);

  let name = user.name;
  let [start, end] = airForceTime(user.generation);
  let message = user.message;
  return (
    <div className="pt-4 pb-3.5 w-full">
      <h2 className={styles.title}>
        <span className="text-primary">{name}</span> 훈련병에게
        <br />
        편지를 보내주세요!
      </h2>
      <div className="pt-px w-full">
        <h2 className={styles.time}>
          {start} ~ {end}
        </h2>
      </div>
      <div className="pt-2 w-full">
        <h2 className={styles.message}>{message}</h2>
      </div>
    </div>
  );
}
