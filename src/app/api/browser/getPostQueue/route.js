import { NextResponse } from "next/server";
import { parseKorea } from "src/lib/time";
import { PostQueue, Post } from "src/db";

export async function GET() {
  const list = await PostQueue.findAll();

  let transformedArray = list.map((item) => {
    // 각 객체에 대해 user와 post 속성을 해체하여 상위 객체에 통합
    return {
      ...item,
      ...item.user,
      ...item.post,
    };
  });

  for (let i = 0; i < transformedArray.length; i++) {
    let ar = transformedArray[i];
    const dateJs = parseKorea(ar.createdAt);
    const formattedDate = dateJs.format("YYYY.MM.DD HH:mm:ss");

    transformedArray[i].createdAt = formattedDate;
  }

  const max = 1000;

  return NextResponse.json(
    { message: transformedArray.slice(0, max) },
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      },
    },
  );
}
