
import { User } from "src/db";
import { notFound } from "next/navigation";
import { Client } from "./client";
import { auth } from "src/app/api/auth/auth";

export default async function Page() {
  const session = await auth();

  if (!session || !session.user || !session.user.email)  notFound();

  const username = session.user.email;
  
  const user = await User.findByUsername(username);
  if (!user)  notFound();
  
  return <Client username={username}></Client>;
}
