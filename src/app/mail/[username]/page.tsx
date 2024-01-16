import styles from "./page.module.css";
import { Submit } from "./submit";
import { MakeBtn } from "./MakeBtn";
import { Paper } from "./paper";
import { getEnter, getCompletion, isContain } from "src/lib/time";
import { User } from "src/db";
import { notFound } from "next/navigation";
import { Share } from "public/assets";
import Image from "next/image";

export default async function Mail({ params }) {
  return (
    <div className="screen">
      <Header username={params.username}></Header>
      <Paper></Paper>
      <MakeBtn></MakeBtn>
      <Submit username={params.username}></Submit>
    </div>
  );
}

async function Header(params) {
  let user = await User.findByUsername(params.username);

  if (!user) {
    notFound();
  }
  // console.log(user);

  let name = user.name;
  let message = user.message;

  let startTime = "2x.xx.xx";
  let compTime = "2x.xx.xx";
  if (isContain(user.generation)) {
    startTime = getEnter(user.generation).format("YY.MM.DD");
    compTime = getCompletion(user.generation).format("YY.MM.DD");
  }
  return (
    <div className="pt-4 pb-3.5 w-full">
      <div style={{ display: "flex", flexDirection: "row",justifyContent:'start' }}>
        <h2 className={styles.title}>
          <span className="text-primary">{name}</span> 훈련병에게
          <br />
          편지를 보내주세요!
        </h2>
        <div style={{ flex: 1 }}></div>
        <div> <Image className={styles.icon} src={Share} alt="로고" /></div>
       
      </div>

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
