// "use server";
// import { User } from "src/db";
// import {
//   ServerActionResponse,
//   ensureUserMatch,
// } from "../serverActionResponse";
// import { bean } from "src/bean/bean";
// import { labelLogger } from "config/logger/labelLogger";

// export async function getProfile(username: string) {
//   const { valid, errorResponse } = await ensureUserMatch(username);
//   if (!valid) return errorResponse;

//   const { userRepository } = bean;
//   const user = await userRepository.findByUsername(username);
//   return ServerActionResponse.ok(user);

// }


// // 계정 삭제할 때 비밀번호도 받는다.
// export async function deleteUser(username: string, password: string) {
//   const logger = labelLogger("DeleteUser");

//   const { valid, errorResponse } = await ensureUserMatch(username);
//   if (!valid) return errorResponse;

//   const user = await User.findByUsername(username);
//   if (user?.password == password) {
//     await User.deleteByUsername(username);
//     logger.info(`${username} (${user.id})`)
//     return ServerActionResponse.ok("회원탈퇴에 성공했습니다.");
//   } else {
//     return ServerActionResponse.notFound("비밀번호가 틀렸습니다.");
//   }

// }

// export async function editProfile(username, name, birth, message) {
//   const { userService, userRepository } = bean;
//   const { valid, errorResponse } = await ensureUserMatch(username);
//   if (!valid) return errorResponse;

//   const user = await userRepository.findByUsername(username);

//   const response = await userService.editProfile(user!.id, { name, birth, message });
//   return ServerActionResponse.ok("유저 정보 수정에 성공했습니다.");


// }

// export async function editPassword(
//   username: string,
//   encryptedOriginPassword: string,
//   encryptedPassword: string,
// ) {
//   const { userService, userRepository } = bean;

//   const { valid, errorResponse } = await ensureUserMatch(username);
//   if (!valid) return errorResponse;

//   const user = await userRepository.findByUsername(username);
//   if (encryptedOriginPassword != user?.password) {
//     return ServerActionResponse.notFound("비밀번호를 다시 입력해주세요.");
//   }
//   await userService.editPassword(user!.id, encryptedPassword);

//   return ServerActionResponse.ok("비밀번호 수정에 성공했습니다.");
// }
