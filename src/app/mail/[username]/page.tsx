import styles from "./page.module.css";
import { Submit } from "./submit";
import { MakeBtn } from "./MakeBtn";
import { Paper } from "./paper";
import Link from "next/link";

import { Nav } from "src/components";
import {
  getEnter,
  getCompletion,
  knowTime,
  Status,
  serveStatus,
} from "src/lib/time";
import { User } from "src/db";
import { notFound } from "next/navigation";
import { Share } from "public/assets";
import Image from "next/image";

export default async function Mail({ params }) {
  const { username } = params;
  let user = await User.findByUsername(username);

  if (!user) {
    notFound();
  }

  const { generation } = user;

  const status = serveStatus(generation);

  switch (status) {
    case Status.before:
    case Status.beginning:
    case Status.training:
    case Status.ending:

    // TODO: 이거 지워
    //case Status.working:
      return (
        <div className="screen">
          <Header user={user}></Header>
          <Paper></Paper>
          <MakeBtn></MakeBtn>
          <Submit username={username}></Submit>
        </div>
      );

    case Status.working:
    case Status.discharged:
      return <div className="screen">
        <div style={{flex:178}}></div>
        <div style={{paddingBottom:54}}>
          <h1 style={{fontSize:25, fontWeight:500}}>오유찬님<br/>수료를 축하드립니다!</h1>
        </div>
        <h2 style={{fontSize:18}}>받은 편지를 다시보고 싶으시면<br/>아래 버튼을 눌러주세요!</h2>
        <div style={{flex:260}}></div>
        <Nav>
          <Link className={`submit`} href={`/mailbox/${username}`}>
            받은 편지 보기
          </Link>
        </Nav>
      </div>;
  }
}

async function Header({ user }) {
  // console.log(user);
  const { name, message, generation } = user;

  const startTime = getEnter(generation).format("YY.MM.DD");
  const compTime = getCompletion(generation).format("YY.MM.DD");

  return (
    <div className="pt-4 pb-3.5 w-full">
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "start",
        }}
      >
        <h2 className={styles.title}>
          <span className="text-primary">{name}</span> 훈련병에게
          <br />
          편지를 보내주세요!
        </h2>
        <div style={{ flex: 1 }}></div>
        <div>
          <Image className={styles.icon} src={Share} alt="로고" />
        </div>
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
