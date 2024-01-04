import Rokaf from "../rokaf/rokaf";
import {getNow} from 'src/lib/time';
// knex
const knex = require("knex")({
  client: "postgres",
  connection: process.env.DATABASE_URL,
  pool: { min: 0, max: 80 },
});

export async function repostMail() {
  console.log("repostMail...");
  
  const unposted = await knex("post_queue")
    .select(
      "post_queue.*",
      "users.username",
      "users.memberSeq",
      "users.sodae",
      "post.name",
      "post.relationship",
      "post.title",
      "post.contents",
      "post.password",
    )
    .innerJoin("users", "post_queue.user_id", "users.id")
    .innerJoin("post", "post_queue.post_id", "post.id");

  console.log("repost: 편지 보내기 시작, 미발송 편지 수:", unposted.length);

  for (const post of unposted) {
    console.log(post);
    let postComplete = await Rokaf.postMail({
      name: post.name,
      relationship: post.relationship,
      title: post.title,
      contents: post.password,
      password: post.password,
      memberSeq: post.memberSeq,
      sodae: post.sodae,
    }); // 국방서버에 보내는 요청
    if (postComplete.complete) {
      console.log("성공!!", post.post_id, post.username);
      await updatePost(post.post_id);
      await deletePostQueue(post.post_id);
    } else {
      console.log("실패ㅜ");
      console.log("repostMail Stopped!");
      knex.destroy();
      return;
    }
  }

  knex.destroy();
  console.log("repostMail Complete!");
}

async function updatePost(postId) {
  await knex("post").where("id", postId).update({
    posted: true,
    post_at: getNow(),
  });
}
async function deletePostQueue(postId) {
  await knex("post_queue").where("post_id", postId).del();
}
