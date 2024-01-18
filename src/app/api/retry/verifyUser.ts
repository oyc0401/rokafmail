import { Status, serveStatus } from "src/lib/time";
import Rokaf from "../rokaf/rokaf";
import { UnconnectedPost, Post, PostQueue, UserQueue, User } from "src/db";

type Unconnected = {
  id: number;
  userId: number;
  user: {
    username: string;
    name: string;
    birth: string;
    generation: number;
    memberSeq: string | null;
    sodae: string | null;
  };
};

export async function verifyUser() {
  console.log("verifyUser...");
  // 미인증 유저들
  const unconnected = await UserQueue.findAll();

  console.log("reconnect: 유저 인증 시작, 미인증 유저 수:", unconnected.length);

  verify(unconnected);

  console.log("verifyUser Complete!");
}

async function verify(unconnected: Array<Unconnected>) {
  for (const unconnect of unconnected) {
    const { userId } = unconnect;
    const { generation, name, birth } = unconnect.user;

    const status = serveStatus(generation);
    if (status == Status.training) {
      let { serverOn, connect, sodae, memberSeq } = await Rokaf.getProfile(
        name,
        birth,
      );

      // 서버가 통신이 끊기면 바로 종료
      if (!serverOn) {
        console.log("verify Stopped!");
        return;
      }
      // 얻었으면 업데이트
      if (connect && sodae != null && memberSeq != null) {
        await updateUser({ userId, sodae, memberSeq });
        await moveQueue({ userId });
      }
    }
  }
}

// 소대번호, 멤버번호 추가하고, 인증됐다고 업데이트
async function updateUser({
  userId,
  sodae,
  memberSeq,
}: {
  userId: number;
  sodae: string;
  memberSeq: string;
}) {
  await User.update(userId, { connect: true, sodae, memberSeq });

  // 유저큐에서 삭제
  await UserQueue.deleteByUserId(userId);
}

// 모든 연결안된 메일들을 대기열에 올리기
async function moveQueue({ userId }: { userId: number }) {
  let posts = await UnconnectedPost.findByUserId(userId);
  
  for (const post of posts) {
    const { userId, postId } = post;
    await PostQueue.insert({ userId, postId });
  }

  // delete all
  await UnconnectedPost.deleteByUserId(userId);
}
