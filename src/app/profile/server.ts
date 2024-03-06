"use server";
import { User } from "src/db";

export async function getProfile(username: string) {
  const user = await User.findByUsername(username);
  return user;
}

export async function deleteUser(username: string, password: string) {
  const user = await User.findByUsername(username);
  if (user?.password == password) {
    await User.deleteByUsername(username);
    return true;
  }
  return false;
}

export async function editProfile(username, name, birth, message) {
  await User.editProfile({ username, name, birth, message });
}

export async function editPassword(username, password) {
  await User.editPassword({ username, password });
}
