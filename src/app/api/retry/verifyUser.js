import Rokaf from "../rokaf/rokaf";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function verifyUser() {
  console.log("verifyUser...");
  // 미인증 유저들
  const unconnected = await prisma.usersQueue.findMany({
    select: {
      id: true,
      userId: true,
      user: {
        select: {
          name: true,
          birth: true,
        },
      },
    },
    include: {
      user: true,
    },
  });


  // console.log(unconnected);

  console.log("reconnect: 유저 인증 시작, 미인증 유저 수:", unconnected.length);

  for (const user of unconnected) {
    let data = await Rokaf.getProfile(user.name, user.birth);

    // 서버가 통신이 끊기면 바로 종료
    if (!data.serverOn) {
      console.log("verifyUser Stopped!");
      return;
    }
    if (data.connect) {
      console.log(data);
      await updateUser(user.id, user.sodae, user.memberSeq);
      await moveQueue(user.user_id);
    }
  }

  console.log("verifyUser Complete!");
}

async function updateUser(userId, sodae, memberSeq) {
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      connect: true,
      sodae,
      memberSeq,
    },
  });

  await prisma.usersQueue.delete({
    where: {
      id: userId,
    },
  });
}

async function moveQueue(userId) {
  let posts = await prisma.unconnectedPost.findMany({
    where: {
      userId,
    },
  });
  console.log(posts);
  for (const post of posts) {
    await prisma.postQueue.create({
      data: {
        userId: post.user_id,
        postId: post.post_id,
      },
    });
  }

  // delete all
  await prisma.unconnectedPost.deleteMany({
    where: {
      userId,
    },
  });
}
