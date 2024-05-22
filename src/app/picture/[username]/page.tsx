import { notFound } from "next/navigation";
import styles from "./page.module.css";
import Link from "next/link";
import { BasicBody, BasicFormArea, BasicHeader } from "src/components";
import { User } from "src/db";


export const metadata = {
  title: "하늘인편 | 훈련병 사진",
};



export default async function Mail({ params }) {
  const username = params.username;

  const user = await User.findByUsername(username);
  if (!user) {
    notFound();
  }

  const battalion = Number(user.sodae?.at(0));



  return <BasicFormArea>
    <BasicHeader>{user.sodae}대대 훈련병 사진</BasicHeader>
    <BasicBody>
      <a>[신병1대대] 신병857기(24-4차) 훈련3주차 훈련사진 및 소대사진</a>
    </BasicBody>
  </BasicFormArea>


}
