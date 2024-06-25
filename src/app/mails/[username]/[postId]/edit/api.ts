'use server'
import { Post } from "src/db";
import { makeLogger } from "config/winston";
const logger = makeLogger("Edit Mail");

import { validateContent, validateMailPassword, validateRelationship, validateTitle, validateWriter } from "src/utils/validate";


export async function editPost({ postId, username, name, relationship, title, contents, password, isPublic }) {

  const post = await Post.findById(postId);
  if (!post || post.user.username != username) return 'Notfound';


  if (post.password != password) {
    return '비밀번호가 틀렸습니다.'
  }

  try {
    validateInput({ name, relationship, title, contents, password })
  } catch (e) {
    return e.message;
  }


  await Post.edit(postId, { name, relationship, title, contents, password, isPublic });

  logger.info(
    `(${postId}) ${username} Edit | ${post.title} | ${post.name} | ${post.relationship}`,
  );
  return '수정완료';
}



function validateInput({
  name,
  relationship,
  title,
  contents,
  password,
}) {
  validateContent(contents);
  validateTitle(title);
  validateMailPassword(password);
  validateRelationship(relationship);
  validateWriter(name);
}
