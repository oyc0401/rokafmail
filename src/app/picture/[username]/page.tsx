import { notFound } from "next/navigation";
import { BasicBody, BasicFormArea, BasicHeader } from "src/components";
import { getUserByUsername } from "src/app/apiSSR/user/server";


export const metadata = {
  title: "하늘인편 | 훈련병 사진",
};



export default async function Mail({ params }) {
  const username = params.username;

  const user = await getUserByUsername(username);
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
