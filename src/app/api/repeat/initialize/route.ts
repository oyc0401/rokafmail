import { NextResponse } from "next/server";
import {Repeat} from '../repeat';

export async function POST(request: Request) {
  const { key } = await request.json();

  console.log('key', key)
  
  if(key != process.env.NEXTAUTH_SECRET){
     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  
  const now = Repeat.getInstance();
  now.start();

  return NextResponse.json({ message: "시작" }, { status: 200 });
}
