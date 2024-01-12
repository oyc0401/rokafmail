import Rokaf from "../rokaf/rokaf";
import {getNow} from 'src/lib/time';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function repostMail() {
  console.log("repostMail...");
  
  const unposted = await prisma.postQueue.findMany({
    select: {
      id: true,
      userId: true,
      postId: true,
      user: {
        select: {
          username: true,
          memberSeq: true,
          sodae: true,
        },
      },
      post: {
        select: {
          name: true,
          relationship: true,
          title: true,
          contents: true,
          password: true,
        },
      },
    },
  });

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
      console.log("성공!!", post.postId, post.username);
      await updatePost(post.postId);
      await deletePostQueue(post.postId);
    } else {
      console.log("실패ㅜ");
      console.log("repostMail Stopped!");
      return;
    }
  }

  console.log("repostMail Complete!");
}


async function updatePost(postId) {
  await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      posted: true,
      postAt: getNow(),
    },
  });
}
async function deletePostQueue(postId) {
  await prisma.postQueue.deleteMany({
    where: {
      postId,
    },
  });

}
