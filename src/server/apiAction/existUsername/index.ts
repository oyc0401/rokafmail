"use server";
import { ActionResponse } from "src/lib/actionResponse";
import { bean } from "src/server/bean/bean";

/**
 * `Server Action`
 * 
 * 해당 username이 이미 존재하는지 알려준다.
 * @status `200`
 */
export async function existUsername(username: string) {
  const { userService } = bean;

  const exist = await userService.existUsername(username);
  return ActionResponse.ok(exist);
}
