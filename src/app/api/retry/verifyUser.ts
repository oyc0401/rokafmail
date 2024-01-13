import Rokaf from "../rokaf/rokaf";
import { UnconnectedPost, Post, PostQueue, UserQueue, User } from "src/db";

export async function verifyUser() {
  console.log("verifyUser...");
  // 미인증 유저들
  const unconnected = await prisma.usersQueue.findMany({
    include: {
      user: {
        select: {
          name: true,
          birth: true,
          sodae: true,
          memberSeq: true,
        },
      },
    },
  });

  // console.log(unconnected);

  console.log("reconnect: 유저 인증 시작, 미인증 유저 수:", unconnected.length);

  for (const unconnect of unconnected) {
    let data = await Rokaf.getProfile(
      unconnect.user.name,
      unconnect.user.birth,
    );

    // 서버가 통신이 끊기면 바로 종료
    if (!data.serverOn) {
      console.log("verifyUser Stopped!");
      return;
    }
    if (data.connect) {
      console.log(data);
      await updateUser(
        unconnect.id,
        unconnect.user.sodae,
        unconnect.user.memberSeq,
      );
      await moveQueue(unconnect.userId);
    }
  }

  console.log("verifyUser Complete!");
}

async function updateUser(userId, sodae, memberSeq) {
  await User.updateMember({ id: userId, connect: true, sodae, memberSeq });

  await UserQueue.deleteByUserId(uerId);
}

async function moveQueue(userId) {
  let posts = await UnconnectedPost.findByUserId(userId);

  console.log(posts);
  for (const post of posts) {
    const { userId, postId } = post;
    await PostQueue.insert({ userId, postId });
  }

  // delete all
  await UnconnectedPost.deleteByUserId(userId);
}
