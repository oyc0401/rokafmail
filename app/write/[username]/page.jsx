import Write from "./write"
import Timer from "./timer"



const knex = require("knex")({
  // We are using PostgreSQL
  client: "postgres",
  // Use the `DATABASE_URL` environment variable we provide to connect to the Database
  // It is included in your Replit environment automatically (no need to set it up)
  connection: process.env.DATABASE_URL,

  // Optionally, you can use connection pools to increase query performance
  pool: { min: 0, max: 80 },
});


// 이름, 시간




export default async function Page({ params }) {



  const user = await knex('users')
    .where('username', params.username)
    .first();

  console.log("페이지 로딩!",user)

  return (
    <>
      <div>My Post: {user.name}</div>
      <Timer name={user.name} generation={user.generation}></Timer>
      <Write id={user.id}></Write>
      <a target="_blank" href={`https://www.airforce.mil.kr/user/indexSub.action?codyMenuSeq=156893223&siteId=last2&menuUIType=top&dum=dum&command2=getEmailList&searchName=${user.name}&searchBirth=${user.birth}&memberSeq=${user.memverSeq}`}>
        편지 목록
      </a>
    </>
  )

}