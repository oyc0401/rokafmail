import Link from "next/link";
import styles from "./page.module.css";
import { User } from "src/db";
import { notFound } from "next/navigation";
import { Client } from "./client";

export default async function MailBox({ params }) {
  const { username } = params;
  let user = await User.findByUsername(username);

  if (!user) {
    notFound();
  }
  const { password } = user;

  return (
    <>
      <Client password={password}></Client>
    </>
  );
}
