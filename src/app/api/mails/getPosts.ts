import { Post, PostQueue, UnconnectedPost } from "src/db";


export async function getPosts(username: string) {
  const postsPrivate = await Post.findPrivateByUsername(username);
  const postsPublic = await Post.findPublicByUsername(username);
  const posts = [...postsPrivate, ...postsPublic];
  const postsSorted = posts.sort((a, b) => a.id > b.id ? -1 : 1);
  return postsSorted;
}

export async function getPostQueue(username: string) {

  let queuePrivate = await Post.findPrivateNotPostedByUsername(username);
  let queuePublic = await Post.findPublicNotPostedByUsername(username);
  const queues = [...queuePrivate, ...queuePublic];
  const queueSorted = queues.sort((a, b) => a.id < b.id ? -1 : 1);

  return queueSorted
}
export async function getunc(username: string) {
  let unconnectedPrivate = await UnconnectedPost.findPrivateByUsername(username);
  let unconnectedPublic = await UnconnectedPost.findPublicByUsername(username);
  const unconnects = [...unconnectedPrivate, ...unconnectedPublic];
  const unconnectsSorted = unconnects.sort((a, b) => a.id > b.id ? -1 : 1);

  return unconnectsSorted;
}