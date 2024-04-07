import { Post, PostQueue, UnconnectedPost, User } from "src/db";

export async function getPost(username){
  const postsPrivate = await Post.findPrivateByUsername(username);
  const postsPublic = await Post.findPublicByUsername(username);
  const posts = [...postsPrivate, ...postsPublic];
  const postsSorted = posts.sort((a, b) => a.id > b.id ? -1 : 1);

  let queuePrivate = await PostQueue.findPrivateByUsername(username);
  let queuePublic = await PostQueue.findPublicByUsername(username);
  const queues = [...queuePrivate, ...queuePublic];
  const queueSorted = queues.sort((a, b) => a.id < b.id ? -1 : 1);


  let unconnectedPrivate = await UnconnectedPost.findPrivateByUsername(username);
  let unconnectedPublic = await UnconnectedPost.findPublicByUsername(username);
  const unconnects = [...unconnectedPrivate, ...unconnectedPublic];
  const unconnectsSorted = unconnects.sort((a, b) => a.id > b.id ? -1 : 1);
}