import styles from "./mail.module.css";
import { Body } from "./body";
import airForceTime from "./time";
import { getUser } from "../../server/getUser";
import { notFound } from "next/navigation";

export default async function Mail({ params }) {
  return (
    <>
      <div className="screen">
        <div className="sized" style={{ height: 17 }}></div>
        <Header username={params.username}></Header>
        <div className="sized" style={{ height: 24 }}></div>
        <Body username={params.username}></Body>
      </div>
    </>
  );
}

async function Header(params) {
  let user = await getUser(params.username);

  if (!user) {
    notFound();
  }
  // console.log(user);

  let name = user.name;
  let [start, end] = airForceTime(user.generation);
  let substring = user.substring;
  return (
    <>
      <h2 className="font-medium text-2xl text-left w-full">
        <span className="text-primary">{name}</span> 훈련병에게
        <br />
        편지를 보내주세요!
      </h2>
      <div className="sized" style={{ height: 1 }}></div>
      <h2 className="text-gray-500 font-medium text-sm text-left w-full">
        {start} ~ {end}
      </h2>
      <div className="sized" style={{ height: 10 }}></div>
      <h2 className="font-normal text-base text-left w-full" >{substring}</h2>
    </>
  );
}
