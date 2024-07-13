"use server";
import { User } from "src/db";
import { bean } from "src/server/bean/bean";
import { labelLogger } from "config/logger/labelLogger";
import { ActionResponse } from "src/lib/actionResponse";
import { auth } from "src/auth";

/**
 * `Server Action`
 * 
 * 본인 계정을 삭제한다.
 * @status `200` `401` `404`
 */
export async function deleteUser(password: string) {
  const logger = labelLogger("DeleteUser");

  const session = await auth();
  // 로그인이 되어있지 않으면 unauthorized (401)
  if (!session?.user.username) return ActionResponse.unauthorized();

  const username = session.user.username;

  const user = await User.findByUsername(username);
  if (user?.password == password) {
    await User.deleteByUsername(username);
    logger.info(`${username} (${user.id})`)
    return ActionResponse.ok("회원탈퇴에 성공했습니다.");
  } else {
    return ActionResponse.notFound("비밀번호가 틀렸습니다.");
  }

}

/**
 * `Server Action`
 * 
 * 프로필을 수정한다.
 * @status `200` `401`
 */
export async function editProfile(name, birth, message) {
  const { userService, userRepository } = bean;

  const session = await auth();
  // 로그인이 되어있지 않으면 unauthorized (401)
  if (!session?.user.username) return ActionResponse.unauthorized();

  const username = session.user.username;

  const user = await userRepository.findByUsername(username);

  const response = await userService.editProfile(user!.id, { name, birth, message });
  return ActionResponse.ok("유저 정보 수정에 성공했습니다.");
}

/**
 * `Server Action`
 * 
 * 프로필을 수정한다.
 * @status `200` `401` `404`
 */
export async function editPassword(
  encryptedOriginPassword: string,
  encryptedPassword: string,
) {
  const { userService, userRepository } = bean;

  if (encryptedOriginPassword == encryptedPassword) {
    return ActionResponse.notFound("동일한 비밀번호로 변경할 수 없습니다.");
  }

  const session = await auth();
  // 로그인이 되어있지 않으면 unauthorized (401)
  if (!session?.user.username) return ActionResponse.unauthorized();

  const username = session.user.username;

  const user = await userRepository.findByUsername(username);
  if (encryptedOriginPassword != user?.password) {
    return ActionResponse.notFound("비밀번호를 다시 입력해주세요.");
  }

  await userService.editPassword(user!.id, encryptedPassword);

  return ActionResponse.ok("비밀번호 수정에 성공했습니다.");
}
