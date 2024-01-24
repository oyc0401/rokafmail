import { NextResponse } from "next/server";

import { getNow } from "src/lib/time";
import {
  Post,
  PostQueue,
  UnconnectedPost,
  User,
  UserQueue,
  UnidentifiedUser,
} from "src/db";
import { verifyUser } from "src/app/api/retry/verifyUser";
import { repostMail } from "src/app/api/retry/repostMail";

export async function GET() {
  // console.log("start test", getNow());
  // let data = await Post.findByUsername("전진우");
  // console.log(data);
  // await PostQueue.deleteByPostId(1);


  // let data22 = await PostQueue.findByUsername("전진우");
  // console.log(data22)

  // let uni = await UnidentifiedUser.findAll();
  // console.log(uni)

  // for (const u of uni) {
  //  // await UserQueue.insert({ userId: u.userId });
  // await UnidentifiedUser.deleteByUserId(u.userId);
  // }

  //let d = await User.findAll();

  // await verifyRepostMail();

  return NextResponse.json({ message: "테스트 성공" }, { status: 200 });
}

async function verifyUserTest() {
  // 더미 미인증 유저 제작
  const dummyUser = await User.insert({
    username: "dasd",
    password: "password",
    name: "오유찬",
    birth: "20030401",
    generation: 850,
    message: `I am test`,
  });

  await UserQueue.insert({ userId: dummyUser.id });

  // 실행
  await verifyUser();

  // 끝나면 지우기
  console.log(dummyUser.id);
  await User.deleteById(dummyUser.id);
}

async function verifyRepostMail() {
  // // 더미 미인증 유저 제작
  // const dummyUser = await User.insert({
  //   username: "oy21312",
  //   password: "password",
  //   name: "오유찬",
  //   birth: "20030401",
  //   generation: 850,
  //   message: `I am test`,
  // });

  // await UserQueue.insert({ userId: dummyUser.id });

  // const dummyPost = await Post.insert({
  //   userId: dummyUser.id,
  //   name: "이름",
  //   relationship: "친구",
  //   title: "제목",
  //   contents: "내용",
  //   password: "비번",
  // });

  // await UnconnectedPost.insert({ postId: dummyPost.id, userId: dummyUser.id });

  await verifyUser();

  // 실행
  await repostMail();

  // 끝나면 지우기
  // console.log(dummyUser.id);
  // await User.deleteById(dummyUser.id);
}
