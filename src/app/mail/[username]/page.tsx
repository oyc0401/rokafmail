import Link from "next/link";
import { notFound } from "next/navigation";

import { BasicFooter } from "src/components";
import { NavHeader } from 'src/components'
import { getEnter, getCompletion, canSearch, Status, serveStatus, getDischarge } from "src/lib/time";
import { getUserByUsername } from "src/server/apiSSR/user/server";
import styles from "./page.module.css";
import { Submit } from "./submit";
import { Paper } from "./paper";
import { ShareButton } from "./copy_button";
import dayjs, { Dayjs } from "dayjs";

export const metadata = {
  title: "하늘인편 | 편지 작성",
  openGraph: {
    description: "링크를 눌러 편지를 작성해주세요",
  },
};

export default async function Mail({ params }) {
  const username = decodeURI(params.username);
  const user = await getUserByUsername(username);
  if (!user) {
    notFound();
  }

  const { generation, connect, name, birth } = user;

  function Banner() {
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
            </a>
            후 정보수정 또는 oyc0401@gmail.com으로 이름과 생년월일을 보내주세요.
          </h2>
        </div>
      );
    }
    return <></>;
    // return <div className="bg-[#F3F3F3] w-full p-6">{""}</div>;
  }

  return (
    <div className="w-full flex flex-col max-w-3xl mx-auto h-full">
      <NavHeader user={user}></NavHeader>
      {/* <Banner></Banner> */}
      <UserDescription user={user}></UserDescription>
      <Paper></Paper>
      <Submit username={username}></Submit>
    </div>
  );
}

async function UserDescription({ user }) {
  const { name, message, generation, username } = user;

  const startDate = getEnter(generation).format("YY.MM.DD");
  const endDate = getDischarge(generation).format("YY.MM.DD");

  const domain = process.env.DOMAIN;
  const url = `https://${domain}/mail/${username}`;

  let milRank = getMilitaryRank(generation);


  return (
    <div role='userDescription' className="pt-3 pb-3.5 w-full px-4">
      <div className="flex flex-row">
        <h2 className={'text-[22px] font-medium text-left'}>
          {milRank} <span className="text-primary">{name}</span>에게
          <br />
          편지를 보내주세요!
        </h2>
        <div style={{ flex: 1 }}></div>
        <ShareButton url={url} name={name}></ShareButton>
      </div>

      <div className="pt-px w-full">
        <h2 className='text-sm font-medium text-left text-fontlight'>
          {startDate} ~ {endDate}
        </h2>
      </div>
      <div className="pt-2 w-full">
        <h2 className='text-medium text-left'>{message}</h2>
      </div>
    </div>
  );
}


export function getMilitaryRank(generation: number) {
  const status = serveStatus(generation);

  switch (status) {
    case Status.before:
    case Status.beginning:
    case Status.training:
    case Status.ending:
      return '훈련병';
  }

  const date = getEnter(generation);
  const now = dayjs();
  const diffMonths = now.diff(date, 'month');

  if (diffMonths < 2) {
    return '이병';
  } else if (diffMonths < 8) {
    return '일병';
  } else if (diffMonths < 14) {
    return '상병';
  } else if (diffMonths < 21) {
    return '병장';
  } else {
    return '민간인';
  }
}
