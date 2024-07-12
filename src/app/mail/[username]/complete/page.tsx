import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { User } from "src/db";
import { BasicFooter, NavHeader } from "src/components";

import {
  mailStartIsFuture,
  diffDay,
  getMailStart,
  getMailEnd,
  postMailDMinute,
  minuteToStr,
} from "src/lib/time";
import { CheckCircle } from "public/assets/index";
import { getUserByUsername } from "src/app/apiSSR/user/server";

///res?sc=200&searchName=곽희근&searchBirth=19950824&memberSeqVal=347938631
export default async function Complete({ searchParams, params }) {
  //const sc = searchParams.sc;
  const username = decodeURI(params.username);
  const user = await getUserByUsername(username);

  if (!user) {
    notFound();
  }

  // 전달 성공
  // 국방서버이슈
  // 유저x
  //

  let page = <Good name={user.name}></Good>;

  // 편지 시작 이전에 보냄
  if (mailStartIsFuture(user.generation)) {
    const minute = postMailDMinute(user.generation);
    const strDate = minuteToStr(minute)

    page = <Later day={strDate} name={user.name}></Later>;
  }

  const { name, birth, memberSeq, connect } = user;
  const userForm = { username, name, birth, memberSeq, connect };

  return (
    <div className="w-full h-full flex flex-col max-w-3xl mx-auto">
      <NavHeader user={userForm}></NavHeader>
      <div style={{ flex: 130 }}></div>
      <div className="w-full">
        <Image className='w-[128px] h-[128px] mx-auto' src={CheckCircle} alt="아이콘" />
      </div>

      <div style={{ height: 28 }}></div>
      <h2 className="font-bold text-2xl">
        편지가 <br /> 전송되었습니다!
      </h2>
      <div style={{ flex: 28 }}></div>
      {page}
      <div style={{ flex: 160 }}></div>
      <BasicFooter>
        <a className={`submit mini`} href={`/mails/${user.username}`}>
          편지함
        </a>
        <Link className={"submit"} href={`/mail/${user.username}`}>
          다시 작성하기
        </Link>
      </BasicFooter>
    </div>
  );
}

// 여러 텍스트 컴포넌트 만들기
function Good({ name }) {
  return (
    <p className="text-lg">
      1일 이내에 <span className='text-primary'>{name}</span> 훈련병에게
      <br />
      편지가 전달됩니다!
    </p>
  );
}

function Later({ day, name }) {
  return (
    <p className="text-lg">
      {day} 후에 <span className='text-primary'>{name}</span>{" "}
      훈련병에게
      <br />
      편지가 전달됩니다!
    </p>
  );
}
