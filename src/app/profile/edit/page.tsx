import { auth } from "src/app/api/auth/auth";
import { User } from "src/db";
import { notFound } from "next/navigation";
import { Client } from "./client";
export const metadata = {
  title: "하늘인편 | 정보 수정",
};
export default async function Page() {
  const session = await auth();
  if (!session || !session.user || !session.user.email) {
    notFound();
  }
  const username = session.user.email;
  const user = await User.findByUsername(username);

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
