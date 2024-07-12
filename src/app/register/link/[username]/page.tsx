import Image from "next/image";

import { CheckCircle, CopyIcon } from "public/assets/index";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getUserByUsername } from "src/server/apiSSR/user/server";
import { BasicFooter, NavHeader } from "src/components";
import { LinkButton } from "src/components/LinkButton";

export const metadata = {
  title: "하늘인편 | 편지함 생성",
};

export default async function LinkPage({ params }) {
  const username = decodeURI(params.username);

  const user = await getUserByUsername(username);
  if (!user) {
    notFound();
  }
  const domain = process.env.DOMAIN;
  const url = `https://${domain}/mail/${username}`;

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto">
      <NavHeader user={user}></NavHeader>

      <div style={{ flex: 3 }}></div>
      <div className="px-4">
        <Image className='w-24 h-24 mx-auto' src={CheckCircle} alt="아이콘" />
        <h2 className='text-2xl font-medium pt-5'>편지함이 생성되었습니다!</h2>
      </div>
      <div className="pt-16 px-4">
        <LinkButton url={url}></LinkButton>
      </div>

      <p className="pt-4">링크를 복사해 사람들에게 공유하세요</p>

      <div className="flex-4"></div>
      <div style={{ flex: 4 }}></div>
      <p className=''>
        편지함에서 편지를 작성하면
        <br />
        훈련 3주차부터 편지가 발송됩니다
      </p>
      <BasicFooter>
        <Link className={"submit"} href={`/mail/${username}`}>
          편지함 이동
        </Link>
      </BasicFooter>
    </div>
  );
}
