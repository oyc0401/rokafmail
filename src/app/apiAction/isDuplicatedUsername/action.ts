"use server";
import { bean } from "src/bean/bean";

export async function isDuplicatedUsernameApi(username) {
  const { userService } = bean;

  const exist = await userService.existUsername(username);
  return exist;
}
