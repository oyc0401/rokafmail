'use server'
import { Post } from "src/db";
export async function editPost({ postId, username, name, relationship, title, contents, password }) {

  const post = await Post.findById(postId);
  if (!post || post.user.username != username) return 'Notfound';

  
  if (post.password != password) {
    return '비밀번호가 틀렸습니다.'
  }

  await Post.edit(postId, { name, relationship, title, contents, password });

  return '수정완료';
}
