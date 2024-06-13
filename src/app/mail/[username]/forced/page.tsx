import { Submit } from "../submit";
import { Paper } from "../paper";
import {
  getEnter,
  getDischarge
} from "src/lib/time";
import { User } from "src/db";
import { notFound } from "next/navigation";
import { ShareButton } from "../copy_button";
import { NavHeader } from 'src/components'
import { Dayjs } from "dayjs";
const dayjs = require('dayjs');


export const metadata = {
  title: "하늘인편 | 편지 작성",
};

export default async function Mail({ params }) {
  const username = decodeURI(params.username);
  const user = await User.findByUsername(username);
  if (!user) {
    notFound();
  }
  return (
    <div className="w-full flex flex-col max-w-3xl mx-auto h-full">
      <NavHeader user={user}></NavHeader>
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

  const milRank = getMilitaryRank(getEnter(generation));
  return (
    <div role='userDescription' className="pt-3 pb-3.5 w-full px-4">
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "start",
        }}
      >
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


function getMilitaryRank(date:Dayjs) {
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