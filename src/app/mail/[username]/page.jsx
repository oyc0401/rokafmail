import styles from "./page.module.css";
import { Submit } from "./submit";
import { MakeBtn } from "./MakeBtn";
import { Paper } from "./paper";
import { getEnter, getCompletion, isContain } from "src/lib/time";
import { getUser } from "src/server";
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
  let message = user.message;

  let startTime;
  let compTime;
  if (!isContain(user.generation)) {
    startTime = "2x.xx.xx";
    compTime = "2x.xx.xx";
  } else {
    startTime = getEnter(user.generation).format("YY.MM.DD");
    compTime = getCompletion(user.generation).format("YY.MM.DD");
  }

  return (
    <div className="pt-4 pb-3.5 w-full">
      <h2 className={styles.title}>
        <span className="text-primary">{name}</span> 훈련병에게
        <br />
        편지를 보내주세요!
      </h2>
      <div className="pt-px w-full">
        <h2 className={styles.time}>
          {startTime} ~ {compTime}
        </h2>
      </div>
      <div className="pt-2 w-full">
        <h2 className={styles.message}>{message}</h2>
      </div>
    </div>
  );
}
