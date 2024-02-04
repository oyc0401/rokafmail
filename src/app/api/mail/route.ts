import { NextResponse } from "next/server";
import { getNow, serveStatus, Status } from "src/lib/time";
import Rokaf from "../rokaf/rokaf";
import { Post, PostQueue, UnconnectedPost, User } from "src/db";

// 편지를 보내면 먼저 post에 저장한다.
// 인증안된 유저면 unconnected에 추가
// 인증된 유저는
// 편지쓰기 가능한 기간이면 보내고 아니면 그냥 둔다.
// 보내지면 posted를 true로 업데이트한다.
// 안보내지면 post_queue에 추가한다.
import { makeLogger } from "config/winston";
const logger = makeLogger("mail");


export async function POST(request: Request) {
  const {
    username,
    name,
    relationship,
    title,
    contents,
    password,
  }: {
    username: string;
    name: string;
    relationship: string;
    title: string;
    contents: string;
    password: string;
  } = await request.json();

  // 유저인지 확인
  const user = await User.findByUsername(username);

  // 유저가 아니면 400에러 ㄱㄱ
  if (!user) {
    return NextResponse.json(
      { message: "해당 유저를 찾을 수 없습니다." },
      { status: 400 },
    );
  }

  const { memberSeq, sodae, connect, generation } = user;
  console.log(`${username} 편지 업로드 중...`);
  console.log(`connect: ${connect}`);

  const userId = user.id;
  // 편지 저장
  const newPost = await Post.insert({
    userId,
    name,
    relationship,
    title,
    contents,
    password,
  });

  const postId = newPost.id;
  console.log("post 업로드 성공.");

  // 인증안된 유저면 인증안된 큐에 데이터 저장
  if (!connect) {
    UnconnectedPost.insert({
      postId,
      userId,
    }).then(() => {
      console.log(`unconnected_post 업로드 성공.`);
      console.log(`${username} 편지 전송 완료!`);
    });
  } else {
    sendMail({
      userId,
      postId,
      username,
      name,
      relationship,
      title,
      contents,
      password,
      memberSeq,
      sodae,
      generation,
    });
  }

  logger.info(`${userId} 에게 ${postId} ${name} ${relationship} ${title} ${contents} ${password} 편지 보냄`);
  return NextResponse.json({ message: "편지 전송 성공!" }, { status: 200 });
}

async function sendMail({
  userId,
  postId,
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
  // 배포하기전 이거 꼭 지워
  //if (true) {

  const status = serveStatus(generation);

  // 국방부 서버 보내는건 편지쓰기 기간에만 가능, 어짜피 다른시간에 보내도 도착안함
  switch (status) {
    case Status.training:
     
      
      console.log("국방부 서버 보내는 중...");
      const response = await Rokaf.postMail({
        name,
        relationship,
        title,
        contents,
        password,
        memberSeq,
        sodae,
      });

      // 국방서버에 보내졌으면 보내졌다고 업데이트
      if (response.complete) {
        console.log("국방부 서버 보내기 성공.");
        await Post.update(postId, { posted: true, postAt: getNow() });
      } else {
        // 안보내졌으면 편지큐에 저장
        console.log("국방부 서버 보내기 실패.");
        await PostQueue.insert({ postId, userId });
      }
      break;

    case Status.before:
    case Status.beginning:
      // 안보내졌으면 편지큐에 저장
      console.log("편지쓰기 기간 이전입니다.");
      await PostQueue.insert({ postId, userId });
      break;

    case Status.ending:
    case Status.working:
    case Status.discharged:
      console.log("편지 쓰기 기간이 지났습니다.");
      await Post.update(postId, { posted: true, postAt: getNow() });
      break;
  }

  console.log(`${username} 편지 전송 완료!`);
}
