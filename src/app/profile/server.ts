'use server'
import { User } from "src/db";

export async function getProfile(username:string) {
  const user = await User.findByUsername(username);
  return user;
}
