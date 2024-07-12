import { auth } from "src/auth";
import { notFound } from "next/navigation";
import { Client } from "./client";
import { getUserByUsername } from "src/app/apiSSR/user/server";
export const metadata = {
  title: "하늘인편 | 정보 수정",
};
export default async function Page() {
  const session = await auth();
  if (!session || !session.user || !session.user.email) {
    notFound();
  }
  const username = session.user.email;
  const user = await getUserByUsername(username);

  if (!user)  notFound();
  
  const { name, birth, message } = user;

  return (
    <Client
      username={username}
      name={name}
      birth={birth}
      message={message}
    ></Client>
  );
}
