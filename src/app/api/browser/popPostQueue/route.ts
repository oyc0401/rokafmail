import { NextResponse } from "next/server";
import { PostQueue, Post } from "src/db";
import { getNow, serveStatus, Status } from "src/lib/time";

export async function POST(request: Request) {
const {
  postId
}= await request.json()

  console.log('전송 됌',postId);

  relocatePost(postId);

  return NextResponse.json(
    { message: 'good!' },
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
      },
    },
  );


}

async function relocatePost(postId: number) {
  await Post.update(postId, { posted: true, postAt: getNow() });

  await PostQueue.deleteByPostId(postId);
}