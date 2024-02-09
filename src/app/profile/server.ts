"use server";
import { User } from "src/db";

export async function getProfile(username: string) {
  const user = await User.findByUsername(username);
  return user;
}

export async function deleteUser(username: string) {
  await User.deleteByUsername(username);
}

export async function editProfile(username, name, birth, message) {
  await User.editProfile({ username, name, birth, message });
}

export async function editPassword(username,password) {
  await User.editPassword({ username, password});
}




