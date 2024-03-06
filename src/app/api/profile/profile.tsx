"use server";
import { User } from "src/db";
import { auth } from "src/app/api/auth/auth";
import { ServerActionResponse,ServerActionAuth } from "../serverActionResponse";

export async function getProfile(username: string) {
  // next-auth를 통한 유저 인증
  const session = await auth();

  // 로그인이 되어있지 않으면 unauthorized (401)
  if (!session || !session.user || !session.user.email)
    return ServerActionResponse.unauthorized();

  // 해당 유저 정보가 없으면 notFound (404)
  const sessionUsername = session.user.email;
  const user = await User.findByUsername(sessionUsername);
  if (!user) return ServerActionResponse.notFound();

  // 본인이 아닌 다른사람 정보에 접근하려고하면 forbidden (403)
  if (username != sessionUsername) return ServerActionResponse.forbidden();

  return ServerActionResponse.ok(user);
}

export async function deleteUser(username: string) {
  // next-auth를 통한 유저 인증
  const session = await auth();

  // 로그인이 되어있지 않으면 unauthorized (401)
  if (!session || !session.user || !session.user.email)
    return ServerActionResponse.unauthorized();

  // 해당 유저 정보가 없으면 notFound (404)
  const sessionUsername = session.user.email;
  const user = await User.findByUsername(sessionUsername);
  if (!user) return ServerActionResponse.notFound();

  // 본인이 아닌 다른사람 정보에 접근하려고하면 forbidden (403)
  if (username != sessionUsername) return ServerActionResponse.forbidden();

  return ServerActionResponse.ok("회원탈퇴에 성공했습니다.");
}

export async function editProfile(username, name, birth, message) {
  // next-auth를 통한 유저 인증
  const session = await auth();

  // 로그인이 되어있지 않으면 unauthorized (401)
  if (!session || !session.user || !session.user.email)
    return ServerActionResponse.unauthorized();

  // 해당 유저 정보가 없으면 notFound (404)
  const sessionUsername = session.user.email;
  const user = await User.findByUsername(sessionUsername);
  if (!user) return ServerActionResponse.notFound();

  // 본인이 아닌 다른사람 정보에 접근하려고하면 forbidden (403)
  if (username != sessionUsername) return ServerActionResponse.forbidden();

  await User.editProfile({ username, name, birth, message });

  return ServerActionResponse.ok("유저 정보 수정에 성공했습니다.");
}

export async function editPassword(
  username: string,
  encryptedPassword: string,
) {
  // next-auth를 통한 유저 인증
  const session = await auth();

  // 로그인이 되어있지 않으면 unauthorized (401)
  if (!session || !session.user || !session.user.email)
    return ServerActionResponse.unauthorized();

  // 해당 유저 정보가 없으면 notFound (404)
  const sessionUsername = session.user.email;
  const user = await User.findByUsername(sessionUsername);
  if (!user) return ServerActionResponse.notFound();

  // 본인이 아닌 다른사람 정보에 접근하려고하면 forbidden (403)
  if (username != sessionUsername) return ServerActionResponse.forbidden();

  await User.editPassword({ username, password: encryptedPassword });
  return ServerActionResponse.ok("비밀번호 수정에 성공했습니다.");
}

export async function test(username: string) {
  return await ServerActionAuth({
    requireAuth: true,
    author: "username",
  }).response(async () => {
    const user = await User.findByUsername(username);
    return ServerActionResponse.ok(user);
  });
}
