"use server";

import { Post } from "src/db";
import { makeLogger } from "config/winston";
import { ActionResponse } from "src/app/apiSSR/actionResponse";
const logger = makeLogger("Delete Mail");

/**
 * `Server Action`
 * 
 * 해당 편지를 삭제한다.
 * @status `200` `401` `404`
 */
export async function deleteMail(id: number, password: string) {
  const post = await Post.findById(id);

  if (!post) return ActionResponse.notFound("해당 편지가 없습니다.");

  if (post.password == password) {
    await Post.deleteById(id);
    logger.info(`(${id}) ${post.user.username} Delete | ${post.title} | ${post.name} | ${post.relationship}`);
    return ActionResponse.ok("편지 삭제에 성공했습니다.");
  } else {
    return ActionResponse.unauthorized("비밀번호가 틀렸습니다.");
  }
}
