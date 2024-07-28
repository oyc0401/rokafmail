import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { User } from "src/db";
import { BasicFooter, NavHeader } from "src/components";
import { CheckCircle } from "public/assets/index";
import { getUserByUsername } from "src/server/apiSSR/user/server";

///res?sc=200&searchName=곽희근&searchBirth=19950824&memberSeqVal=347938631
export default async function Complete({ searchParams, params }) {
  //const sc = searchParams.sc;
  const username = decodeURI(params.username);
  const user = await getUserByUsername(username);

  if (!user) {
    notFound();
  }

  const { name, birth, memberSeq, connect } = user;
  const userForm = { username, name, birth, memberSeq, connect };

  return (
    <div className="w-full h-full flex flex-col max-w-3xl mx-auto">
      <NavHeader user={userForm}></NavHeader>
      <div style={{ flex: 130 }}></div>
      <div className="w-full">
        <Image className='w-[98px] h-[98px] mx-auto' src={CheckCircle} alt="아이콘" />
      </div>

      <div style={{ height: 28 }}></div>
      <h2 className="font-medium text-xl">
        <span className='text-primary'>{name}</span> 훈련병에게
        <br />
        편지가 전송되었습니다!
      </h2>
      <div style={{ flex: 160 }}></div>
      <p className='text-left text-[#939393] text-xs px-4'>
        이제 훈련병이 휴대폰을 사용해 받은 편지들을 확인할 수 있습니다.
        <br />
        2024년 8월 1일부로 공군에서 주말 휴대폰 사용, 네이버 BAND 활성화로 인해
        인터넷편지를 출력해주지 않습니다
      </p>
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

