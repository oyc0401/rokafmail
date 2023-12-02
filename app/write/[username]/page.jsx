import Write from "./write"
import Timer from "./timer"

// knex
const knex = require("knex")({
  client: "postgres",
  connection: process.env.DATABASE_URL,
  pool: { min: 0, max: 80 },
});


export default async function Page({ params }) {
  const user = await knex('users')
    .where('username', params.username)
    .first();

  console.log("페이지 로딩!", user.username)

  let mailUrl=`https://www.airforce.mil.kr/user/indexSub.action?codyMenuSeq=156893223&siteId=last2&menuUIType=top&dum=dum&command2=getEmailList&searchName=${user.name}&searchBirth=${user.birth}&memberSeq=${user.memberSeq}`;
  return (
    <>
      <div>My Post: {user.name}</div>
      <Timer name={user.name} generation={user.generation}></Timer>
      <Write id={user.id} ></Write>
      <a target="_blank" href={mailUrl}>
        편지 목록
      </a>
    </>
  )

}