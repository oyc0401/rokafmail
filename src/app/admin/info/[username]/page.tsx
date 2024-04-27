import Link from "next/link";
import { notFound } from "next/navigation";
import { Post, User } from "src/db";
import { DatabaseTable } from "./Table";
import { getPosts } from "src/app/api/mails/getPosts";

export default async function Page({ params }) {

  const username = params.username;
  const user = await User.findByUsername(username);
  if (!user) notFound();

  const posts = await Post.findByUserId(user.id);

  return (
    <>
      <div>
        <p>
          이름: {user.name}
        </p>
        <p>
          생년월일: {user.birth}
        </p>
        <Status userId={user.id}></Status>
        <DatabaseTable data={posts}></DatabaseTable>
      </div>
    </>
  );
}


async function Status({ userId }) {
  const user = await User.findById(userId);
  if (!user) notFound();
  return (
    <div>
      <p>
        연결여부: {user.connect ? 'True' : 'False'}
      </p>
      {user.connect ? <></>
        : <>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline m-2">
            syncProfile()</button>
          <p>
            소대번호: {user.sodae}
          </p>
          <p>
            멤버번호: {user.memberSeq}
          </p>
        </>}

    </div>
  )
}