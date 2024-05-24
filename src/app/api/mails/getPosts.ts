import { Post, UnconnectedPost } from "src/db";


export async function getPosts(username: string) {
  const postsPrivate = await Post.findPrivateByUsername(username);
  const postsPublic = await Post.findPublicByUsername(username);
  const posts = [...postsPrivate, ...postsPublic];
  const postsSorted = posts.sort((a, b) => a.id > b.id ? -1 : 1);
  return postsSorted;
}

export async function getPostQueue(username: string) {

  const queuePrivate = await Post.findPrivateNotPostedByUsername(username);
  const queuePublic = await Post.findPublicNotPostedByUsername(username);
  const queues = [...queuePrivate, ...queuePublic];
  const queueSorted = queues.sort((a, b) => a.id < b.id ? -1 : 1);

  return queueSorted
}
export async function getunc(username: string) {
  const unconnectedPrivate = await UnconnectedPost.findPrivateByUsername(username);
  const unconnectedPublic = await UnconnectedPost.findPublicByUsername(username);
  const unconnects = [...unconnectedPrivate, ...unconnectedPublic];
  const unconnectsSorted = unconnects.sort((a, b) => a.id > b.id ? -1 : 1);

  return unconnectsSorted;
}