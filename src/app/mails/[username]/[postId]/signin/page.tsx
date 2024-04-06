
import { notFound } from "next/navigation";
import { LoginPage } from "./LoginPage";
import { Post } from "src/db";

export default async function Page({ params, }) {

  const username = params.username;
  const postId = Number(params.postId);

  const post = await Post.findById(postId);
  if (!post) notFound();

  if (post.user.username != username) notFound();

  return <LoginPage postId={postId} ></LoginPage>
}
