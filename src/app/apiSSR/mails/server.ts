import { Post, User } from "src/db";

export async function getPostedPosts(username) {
  const postsPrivate = await Post.findPrivateByUsername(username);
  const postsPublic = await Post.findPublicByUsername(username);
  const posts = [...postsPrivate, ...postsPublic];
  const postsSorted = posts.sort((a, b) => a.id > b.id ? -1 : 1);
  return postsSorted
}

export async function getNotPostedPosts(username) {
  const queuePrivate = await Post.findPrivateNotPostedByUsername(username);
  const queuePublic = await Post.findPublicNotPostedByUsername(username);
  const queues = [...queuePrivate, ...queuePublic];
  const queueSorted = queues.sort((a, b) => a.id < b.id ? -1 : 1);
  return queueSorted;
}

export async function getNotAuthPosts(username) {
  const queuePrivate = await Post.findPrivateNotPostedByUsername(username);
  const queuePublic = await Post.findPublicNotPostedByUsername(username);
  const queues = [...queuePrivate, ...queuePublic];
  const queueSorted = queues.sort((a, b) => a.id > b.id ? -1 : 1);
  return queueSorted;
}