import { NextResponse } from "next/server";
import { CronStore } from "../cron";

export async function POST(request: Request) {
  const { key } = await request.json();

  if (key != process.env.NEXTAUTH_SECRET) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const mailCron = CronStore.mailCron;
  mailCron.start();

  const userCron = CronStore.userCron;
  userCron.start();

  return NextResponse.json({ message: "시작" }, { status: 200 });
}
