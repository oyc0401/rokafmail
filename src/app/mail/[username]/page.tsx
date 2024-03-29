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
  canSearch,
  Status,
  serveStatus,
} from "src/lib/time";
import { User } from "src/db";
import { notFound } from "next/navigation";

import { ShareButton } from "./copy_button";

import { NavHeader } from 'src/components/NavHeader'

export default async function Mail({ params }) {
  const username = decodeURI(params.username);
  let user = await User.findByUsername(username);
  if (!user) {
    notFound();
  }

  const { generation } = user;

  const status = serveStatus(generation);

  // 편지쓰는 기간은 입대전부터 수료까지. 수료후에 편지 쓰는건 훈련병 입장에서 안좋을듯
  switch (status) {
    case Status.before:
    case Status.beginning:
    case Status.training:
    case Status.ending:
      return (
        <div className="w-full h-full flex flex-col max-w-3xl mx-auto">

          <NavHeader></NavHeader>
          <div className="bg-[#F3F3F3] w-full p-6">{""}</div>
          <div className="w-full px-4 pb-4">

            <Header user={user}></Header>
            <Paper></Paper>

          </div>
          <Submit username={username}></Submit>
          {/* <MakeBtn></MakeBtn> */}

        </div>
      );

    case Status.working:
    case Status.discharged:
      return <After name={user.name} username={username}></After>
  }
}

function After({ name, username }) {
  const callback = `https://${process.env.DOMAIN}/mails/${username}`;

  return (
    <div className="screen">
      <div style={{ flex: 178 }}></div>
      <div style={{ paddingBottom: 54 }}>
        <h1 style={{ fontSize: 25, fontWeight: 500 }}>
          {name}님
          <br />
          수료를 축하드립니다!
        </h1>
      </div>
      <h2 style={{ fontSize: 18 }}>
        받은 편지를 모두 열어보고 싶으시면
        <br />
        로그인 버튼을 눌러주세요!
      </h2>
      <div style={{ flex: 260 }}></div>
      <Nav>
        <Link className={`submit mini`} href={`/mails/${username}`}>
          편지함
        </Link>
        <Link className={`submit`} href={`/auth/signin?callbackUrl=${callback}`}>
          로그인
        </Link>
      </Nav>
    </div>
  );
}

async function Header({ user }) {
  const { name, message, generation, username, birth, connect } = user;

  const startTime = getEnter(generation).format("YY.MM.DD");
  const compTime = getCompletion(generation).format("YY.MM.DD");

  const domain = process.env.DOMAIN;
  const url = `https://${domain}/mail/${username}`;

  function Warning() {
    if (canSearch(generation) && !connect) {
      return (
        <div
          className="mt-2 w-full"
          style={{ background: "#FFF2F2", padding: 6 }}
        >
          <h2 className={styles.alert}>
            ⚠️ 유저검색이 되지 않았습니다.
            <br />
            {`이름: ${name}, 생년월일: ${birth}`}
            <br /> 정보가 잘못 입력되었다면{" "}
            <a className="text-sky-500 underline " href="/profile">
              로그인
            </a>{" "}
            후 정보수정 또는 oyc0401@gmail.com으로 이름과 생년월일을 보내주세요.
          </h2>
        </div>
      );
    }

    return null;
  }

  return (
    <div className="pt-3 pb-3.5 w-full">

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "start",
        }}
      >
        <h2 className={'text-xl font-medium text-left'}>
          <span className="text-primary">{name}</span> 훈련병에게
          <br />
          편지를 보내주세요!
        </h2>
        <div style={{ flex: 1 }}></div>
        <ShareButton url={url} name={name}></ShareButton>
      </div>

      <div className="pt-px w-full">
        <h2 className='text-sm font-medium text-left text-fontlight'>
          {startTime} ~ {compTime}
        </h2>
      </div>
      <div className="pt-2 w-full">
        <h2 className='text-base text-left'>{message}</h2>
      </div>
      <Warning></Warning>
    </div>
  );
}
