import Link from "next/link";
import { notFound } from "next/navigation";
import { Post, UnidentifiedUser, User, UserQueue } from "src/db";
import { DatabaseTable } from "./Table";
import { getPosts } from "src/app/api/mails/getPosts";

export default async function Page({ params }) {

  const username = params.username;
  const user = await User.findByUsername(username);
  if (!user) notFound();

  const posts = await Post.findByUserId(user.id);

  return (
    <>
      <div className="pt-6">
        <div className="flex flex-row w-full">
          <div className="flex-1">
            <p className="text-left text-xl py-2">User ID: {user.id}</p>
            <p className="text-left text-xl py-2">이름: {user.name}</p>
            <p className="text-left text-xl py-2">기수: {user.generation}</p>
          </div>
          <div className="flex-1">
            <p className="text-left text-xl py-2">생년월일: {user.birth}</p>
            <p className="text-left text-xl py-2">상태 메시지: {user.message}</p>
            <p className="text-left text-xl py-2">연결여부: {user.connect ? 'True' : 'False'}</p>
          </div>
        </div>

        <Status userId={user.id}></Status>
        <DatabaseTable data={posts}></DatabaseTable>
      </div>
    </>
  );
}


async function Status({ userId }) {
  const user = await User.findById(userId);
  if (!user) notFound();

  const unidentifies = await UnidentifiedUser.findByUserId(userId);
  const unidentify = unidentifies.length != 0;

  const userQueues = await UserQueue.findByUserId(userId);
  const queueLength = userQueues.length;


  return (
    <div>
      <p>연결여부: {user.connect ? 'True' : 'False'}</p>
      <p>소대번호: {user.sodae}</p>
      <p>멤버번호: {user.memberSeq}</p>

      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline m-2">
        프로필 검색 후 업데이트</button>
      <br />
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline m-2">
        기훈단 프로필 바로가기</button>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline m-2">
        기훈단 인편 바로가기</button>
      <br />
      {user.connect ? <>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline m-2">
          미발송 편지 10개 보내기</button>
        <br />
      </> : <></>}
      
      <p>미등록 유저: {unidentify ? 'True' : 'False'}</p>
      <p>유저큐 등록: {queueLength != 0 ? `${queueLength}개` : 'False'}</p>
      {user.connect ? <></> : <>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline m-2">
          유저 큐 삽입</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline m-2">
          유저 큐 빼기</button>
        <br />
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline m-2">
          미등록 유저 설정</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline m-2">
          미등록 유저 해제</button>
      </>}


    </div>
  )
}
