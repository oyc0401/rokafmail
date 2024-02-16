import { NextResponse } from "next/server";
import { verifyUser } from "src/app/api/retry/verifyUser";
import { repostMail } from "src/app/api/retry/repostMail";
import { makeLogger } from "config/winston";
var cron = require("node-cron");
const logger = makeLogger("repeat");

import {Repeat} from '../repeat';

export async function POST(request: Request) {

  const now = Repeat.getInstance();
  now.start();

  return NextResponse.json({ message: "시작" }, { status: 200 });
}
