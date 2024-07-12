import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { NavHeader } from 'src/components'
import { getUserByUsername } from "src/server/apiSSR/user/server";
import { Paper } from "./paper";
import { getMailById } from "src/server/apiSSR/mails/[username]/[postId]/server";
import { action } from "src/server/actionResponse";

export const metadata = {
  title: "하늘인편 | 편지 확인",
};

async function getMail(postId: number, username: string) {
  // 편지 내용 불러오기, 인증 포함
  
  try {
    const response = await action(getMailById(postId, username));
    return response;
  } catch (error) {
    if (error.status == 401) {
      
      // 편지 내용을 볼 수 없으면 로그인 창으로 이동
      const callbackUrl = `https://${process.env.DOMAIN}/mails/${username}/${postId}`;
      redirect(`/mails/${username}/${postId}/signin?&callbackUrl=${callbackUrl}`)
    }
    
    if (error.status == 404) {
      notFound();
    }
    
    console.error(error.message);
  }
}

async function getUser(username: string) {
  const user = await getUserByUsername(username);
  if (!user) notFound();
  return user;
}

export default async function Page({ params }) {
  const postId = Number(params.postId);
  const username = decodeURI(params.username);

  const mail = await getMail(postId, username);
  const user = await getUser(username);


  function EditButton() {
    return <div className="w-full text-right px-4 pb-4">
      <a className="text-base underline cursor-pointer active:opacity-75 text-fontlight" href={`/mails/${username}/${postId}/edit`}>수정하기</a>
    </div>
  }

  return (
    <div className="w-full flex flex-col max-w-3xl mx-auto h-full">
      <NavHeader user={user}></NavHeader>
      <UserDescription name={user.name}></UserDescription>
      <Paper post={mail}></Paper>
      <EditButton></EditButton>
      <div className="flex-1"></div>
      <footer className="container max-w-3xl mx-auto px-4">
        <div className="row pt-2 sm:pt-3 pb-8">
          <Link className={"submit"} href={`/mails/${username}`}>
            편지함
          </Link>
        </div>
      </footer>
    </div>
  );

}

async function UserDescription({ name }) {
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
          <span className="text-primary">{name}</span> 훈련병에게
          <br></br>
          전송한 편지
        </h2>
      </div>
    </div>
  );
}

