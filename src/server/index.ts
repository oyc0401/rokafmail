"use server";
import { User } from "src/db";

export async function duplicateUsername(username) {
  console.log("아이디 중복확인 중...");
  const duplicate = (await User.countUsername(username)) != 0;
  console.log("아이디 중복확인 완료!", !duplicate);

  return duplicate;
}
