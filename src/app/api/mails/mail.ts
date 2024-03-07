"use server";

import { Post } from "src/db";
import {
  ServerActionResponse,
} from "../serverActionResponse";
import { makeLogger } from "config/winston";
const logger = makeLogger("DeleteMail");

export async function deletePost(id: number, password: string) {
  const post = await Post.findById(id);
  
  if (!post) return ServerActionResponse.notFound("해당 편지가 없습니다.");

  if (post.password == password) {
    await Post.deleteById(id);
    logger.info(
      `${id} 삭제! ${post.title} | ${post.contents} | ${post.name} | ${post.relationship} | ${post.password}`,
    );
    return ServerActionResponse.ok("편지 삭제에 성공했습니다.");
  } else {
    return ServerActionResponse.notFound("비밀번호가 틀렸습니다.");
  }
}
