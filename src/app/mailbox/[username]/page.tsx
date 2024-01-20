import Link from "next/link";
import styles from "./page.module.css";
import { User } from "src/db";
import { notFound } from "next/navigation";
import { Client } from "./client";
import { cookies } from "next/headers";
import crypto from "crypto";
import {deleteCookie} from './cookie'
import {Mailbox} from './mailbox'

export default async function MailBox({ params }) {
  const { username } = params;
  let user = await User.findByUsername(username);

  if (!user) notFound();

  const { password } = user;
  const cookieStore = cookies();
  const pwcookie = cookieStore.get("password");

  if (pwcookie == null) {
    return <Client password={password} username={username}/>;
  }

  if (pwcookie.value == password) {
    return <Mailbox username={username}/>;
  } 

  return <Client password={password} username={username}/>;
}
