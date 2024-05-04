"use server";
import { User } from "src/db";
import {
  ServerActionResponse,
  ensureUserMatch,
} from "../serverActionResponse";
import { makeLogger } from "config/winston";
const logger = makeLogger("Profile");

export async function getProfile(username: string) {
  const { valid, errorResponse } = await ensureUserMatch(username);
  if (!valid) return errorResponse;

  const user = await User.findByUsername(username);
  return ServerActionResponse.ok(user);

}


// 계정 삭제할 때 비밀번호도 받는다.
export async function deleteUser(username: string, password: string) {
  const { valid, errorResponse } = await ensureUserMatch(username);
  if (!valid) return errorResponse;

  const user = await User.findByUsername(username);
  if (user?.password == password) {
    await User.deleteByUsername(username);
    logger.info(`Delete User | ${username} (${user.id})`)
    return ServerActionResponse.ok("회원탈퇴에 성공했습니다.");
  } else {
    return ServerActionResponse.notFound("비밀번호가 틀렸습니다.");
  }

}

export async function editProfile(username, name, birth, message) {
  const { valid, errorResponse } = await ensureUserMatch(username);
  if (!valid) return errorResponse;

  await User.editProfile({ username, name, birth, message });
  return ServerActionResponse.ok("유저 정보 수정에 성공했습니다.");


}

export async function editPassword(
  username: string,
  encryptedPassword: string,
) {
  const { valid, errorResponse } = await ensureUserMatch(username);
  if (!valid) return errorResponse;

  await User.editPassword({ username, password: encryptedPassword });
  return ServerActionResponse.ok("비밀번호 수정에 성공했습니다.");
}
