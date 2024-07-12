"use server";

import { ActionResponse } from "src/app/apiSSR/actionResponse";
import prisma from "src/db/prisma";

/**
 * `Server Action`
 * 
 * 안보내진 편지를 모두 가져온다.
 * @status `200`
 */
export async function getUnpostedLetters(username: string, page: number, limit: number) {
  const list = await prisma.post.findMany({
    select: publicSelect,
    where: { user: { username }, posted: false },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { id: 'desc' }
  });

  let letters: LetterItem[] = [];

  for (let publicLetter of list) {
    if (publicLetter.isPublic) {
      letters.push(publicLetter);
    } else {
      const privateLetter: LetterItem = publicLetter;
      privateLetter.contents = undefined;
      letters.push(privateLetter);
    }
  }

  return ActionResponse.ok(letters);
}

interface LetterItem {
  id: number;
  userId: number;
  name: string;
  relationship: string;
  title: string;
  contents?: string;
  createdAt: Date;
  posted: boolean;
  postAt: Date | null;
  isPublic: boolean;
  user: {
    username: string;
    generation: number;
    connect: boolean;
  };
}

const postSelect = {
  id: true,
  userId: true,
  name: true,
  relationship: true,
  title: true,
  createdAt: true,
  posted: true,
  postAt: true,
  isPublic: true,
  user: {
    select: {
      username: true,
      connect: true,
      generation: true,
    },
  },
}
const privateSelect = {
  ...postSelect,
}

const publicSelect = {
  ...postSelect,
  contents: true,
}