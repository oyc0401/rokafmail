"use server";
import { User } from "src/db";

export async function isDuplicatedUsernameApi(username) {
  const duplicate = (await User.countUsername(username)) != 0;
  return duplicate;
}
