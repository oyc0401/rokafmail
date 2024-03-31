import { CopyButton } from "./copy_button";

import Image from "next/image";

import { CheckCircle } from "public/assets/index";
import { User } from "src/db";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function LinkPage({ params }) {
  const username = decodeURI(params.username);

  const user = await User.findByUsername(username);
  if (!user) {
    notFound();
  }

  const domain = process.env.DOMAIN;
  const url = `https://${domain}/mail/${username}`;

  const { name, generation } = user;

  function copy() {}

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto items-center px-4">
      <div style={{ flex: 151 }}></div>
      <Image className='w-32 h-32' src={CheckCircle} alt="아이콘" />
      <h2 className='text-2xl font-medium pt-7'>편지함이 생성되었습니다!</h2>
      <div style={{ flex: 185 }}></div>
      <h2 className='text-xl pb-8'>
        편지함 링크를 공유하고
        <br />
        인편을 받으세요!
      </h2>
      <Link className={"submit mb-8"} href={`/mail/${username}`}>
        편지함 이동
      </Link>
      
    </div>
  );
}
