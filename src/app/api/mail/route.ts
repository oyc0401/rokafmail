import { NextResponse } from "next/server";
import { getNow, canPost, mailEnded } from "src/lib/time";
import Rokaf from "../rokaf/rokaf";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 편지를 보내면 먼저 post에 저장한다.
// 인증안된 유저면 unconnected에 추가
// 인증된 유저는
// 편지쓰기 가능한 기간이면 보내고 아니면 그냥 둔다.
// 보내지면 posted를 true로 업데이트한다.
// 안보내지면 post_queue에 추가한다.

export async function POST(request: Request) {
  const body = await request.json();

  const {
    username,
    name,
    relationship,
    title,
    contents,
    password,
  }: {
    username: String;
    name: String;
    relationship: String;
    title: String;
    contents: String;
    password: String;
  } = body;

  // 유저인지 확인
  const userList = await prisma.user.findMany({
    where: {
      username,
    },
  });


  // 유저가 아니면 400에러 ㄱㄱ
  if (userList.length == 0) {
    return NextResponse.json(
      { message: "해당 유저를 찾을 수 없습니다." },
      { status: 400 },
    );
  }

  let [user] = userList;
  const { memberSeq, sodae, connect, generation } = user;
  const user_id = user.id;

  console.log(`${username} 편지 업로드 중...`);
  console.log(`connect: ${connect}`);

  // 편지 저장
  const newPost = await prisma.post.create({
    data: {
      userId: user_id,
      name,
      relationship,
      title,
      contents,
      password,
    },
    select: {
      id: true,
    },
  });

  const post_id = newPost.id;
  console.log("post 업로드 성공.");

  // 인증안된 유저면 인증안된 큐에 데이터 저장
  if (!connect) {
    insertUnconnected({
      post_id: post_id,
      user_id: user_id,
    }).then(() => {
      console.log(`unconnected_post 업로드 성공.`);
      console.log(`${username} 편지 전송 완료!`);
    });
  } else {
    sendMail({
      user_id: user_id,
      post_id: post_id,
      username: username,
      name: name,
      relationship: relationship,
      title: title,
      contents: contents,
      password: password,
      memberSeq: memberSeq,
      sodae: sodae,
      generation: generation,
    });
  }

  return NextResponse.json({ message: "편지 전송 성공!" }, { status: 200 });
}

async function sendMail({
  user_id,
  post_id,
  username,
  name,
  relationship,
  title,
  contents,
  password,
  memberSeq,
  sodae,
  generation,
}) {
  // 만약 편지보내기 기간이 아직 안왔으면 안보내고 post_queue에만 저장하고
  // 편지보내기 시간이 지났으면 posted를 true로 업데이트 하되, 국방부 서버에는 보내지 말기

  // 인증된 유저면 국방부에 보내보기

  if (canPost(generation)) {
    console.log("국방부 서버 보내는 중...");
    const response = await Rokaf.postMail({
      name: name,
      relationship: relationship,
      title: title,
      contents: contents,
      password: password,
      memberSeq: memberSeq,
      sodae: sodae,
    });

    // 국방서버에 보내졌으면 보내졌다고 업데이트
    if (response.complete) {
      console.log("국방부 서버 보내기 성공.");
      await updatePosted(post_id);
    } else {
      // 안보내졌으면 편지큐에 저장
      console.log("국방부 서버 보내기 실패.");
      await enqueue({ post_id: post_id, user_id: user_id });
    }
  } else if (mailEnded(generation)) {
    console.log("편지 쓰기 기간이 지났습니다.");
    await updatePosted(post_id);
  } else {
    // 안보내졌으면 편지큐에 저장
    console.log("편지쓰기 기간 이전입니다.");
    await enqueue({ post_id: post_id, user_id: user_id });
  }

  console.log(`${username} 편지 전송 완료!`);
}

function updatePosted(post_id: number) {
  await prisma.post.update({
    where: {
      id: post_id,
    },
    data: {
      posted: true,
      postAt: getNow(),
    },
  });

}

function enqueue({ post_id, user_id }) {
  return prisma.postQueue.create({
    data: {
      postId: post_id,
      userId: user_id,
    },
  });

}

async function insertUnconnected({ post_id, user_id }) {
  return prisma.unconnectedPost.create({
    data: {
      postId: post_id,
      userId: user_id,
    },
  });

}
