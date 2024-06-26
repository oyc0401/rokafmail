import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { NavHeader } from 'src/components'
import { getPostEverything, isSameUser } from "src/app/apiSSR/mail/server";
import { getUserByUsername } from "src/app/apiSSR/user/server";
import { Paper } from "./paper";

export const metadata = {
  title: "하늘인편 | 편지 확인",
};


async function getPostAuthCheck(postId) {
  const post = await getPostEverything(postId);
  if (!post) notFound();

  const { title, contents, name, relationship, posted, isPublic } = post;
  const props = { title, contents, name, relationship, isPublic };

  // 공개글이면 이동
  if (post.isPublic) {
    return props;
  }

  // 비공개 글이면 주인 확인
  const password = post.password;
  const cookieStore = cookies();
  const pwcookie = cookieStore.get("password");

  // 쿠키에 있는게 비밀번호면 주인.
  if (pwcookie && pwcookie.value == password)
    return props;

  return null;
}

export default async function Page({ params }) {
  const postId = Number(params.postId);
  const username = params.username;

  // 해당 편지가 저 유저의 것이 아니면 notFound
  await isSameUser(postId, username);

  // 편지가 넘어오면 인증 절차 다 끝낸거임
  const post = await getPostAuthCheck(postId);

  if (!post) {
    // 볼 수 없으면 로그인 창으로 이동
    const callbackUrl = `https://${process.env.DOMAIN}/mails/${username}/${postId}`;
    redirect(`/mails/${username}/${postId}/signin?&callbackUrl=${callbackUrl}`)
  }

  const user = await getUserByUsername(username);
  if (!user) notFound();

  function EditButton() {
    return <div className="w-full text-right px-4 pb-4">
      <a className="text-base underline cursor-pointer active:opacity-75 text-fontlight" href={`/mails/${username}/${postId}/edit`}>수정하기</a>
    </div>
  }

  return (
    <div className="w-full flex flex-col max-w-3xl mx-auto h-full">
      <NavHeader user={user}></NavHeader>
      <UserDescription name={user.name}></UserDescription>
      <Paper post={post}></Paper>
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

