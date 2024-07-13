import { notFound } from "next/navigation";
import { Client } from "./client";
import { auth } from "src/auth";
import { getUserByUsername } from "src/server/apiSSR/user/server";
export const metadata = {
  title: "하늘인편 | 비밀번호 변경",
};
export default async function Page() {
  const session = await auth();

  if (!session || !session.user || !session.user.username)  notFound();

  const username = session.user.username;
  
  const user = await getUserByUsername(username);
  if (!user)  notFound();
  
  return <Client username={username}></Client>;
}
