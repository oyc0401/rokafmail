"use server";
import { User } from "src/db";

export async function duplicateUsername(username): Promise<boolean> {
  const duplicate = (await User.countUsername(username)) != 0;
  return duplicate;
}
