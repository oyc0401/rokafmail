"use server";
import { User } from "src/db";
import {
  ServerActionResponse,
  ServerActionAuth,
} from "../serverActionResponse";

export const getProfile = async (username: string) =>
  ServerActionAuth({
    requireAuth: true,
    author: username,
  }).action(async () => {
    const user = await User.findByUsername(username);
    return ServerActionResponse.ok(user);
  });

// 계정 삭제할 때 비밀번호도 받는다.
export async function deleteUser(username: string, password: string) {
  return await ServerActionAuth({
    requireAuth: true,
    author: username,
  }).action(async () => {
    const user = await User.findByUsername(username);
    if (user?.password == password) {
      await User.deleteByUsername(username);
      return ServerActionResponse.ok("회원탈퇴에 성공했습니다.");
    } else {
      return ServerActionResponse.notFound("비밀번호가 틀렸습니다.");
    }
  });
}

export async function editProfile(username, name, birth, message) {
  return await ServerActionAuth({
    requireAuth: true,
    author: username,
  }).action(async () => {
    await User.editProfile({ username, name, birth, message });
    return ServerActionResponse.ok("유저 정보 수정에 성공했습니다.");
  });
}

export async function editPassword(
  username: string,
  encryptedPassword: string,
) {
  return await ServerActionAuth({
    requireAuth: true,
    author: username,
  }).action(async () => {
    await User.editPassword({ username, password: encryptedPassword });
    return ServerActionResponse.ok("비밀번호 수정에 성공했습니다.");
  });
}
