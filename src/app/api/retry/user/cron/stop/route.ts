import { NextResponse } from "next/server";

import { CronStore } from "../../../cron";
import { auth } from "src/auth";
import { User } from "src/db";

export async function POST(request: Request) {
  // <어드민 인증 코드>
  const session = await auth();
  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const username = session.user.email;

  const user = await User.findByUsername(username);
  if (!user || username != "oyc0401") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  // </어드민 인증 코드>

  const now = CronStore.userCron;
  now.stop();

  return NextResponse.json({ message: "멈춤" }, { status: 200 });
}
