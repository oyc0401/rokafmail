"use server";
import { User } from "src/db";

export async function duplicateUsername(username) {
  console.log("아이디 중복확인 중...");
  const dup = (await User.countUsername(username)) != 0;
  console.log("아이디 중복확인 완료!", canUse);

  return dup;
}
