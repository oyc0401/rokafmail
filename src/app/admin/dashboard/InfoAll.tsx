import { Post, User } from "src/db";
import { Graph } from './Graph';
import { parseKorea } from "src/lib/time";
import prisma from "src/db/prisma"
function leftPad(value: number) {
  if (value >= 10) {
    return value;
  }
  return `0${value}`;
}

export async function InfoAll() {

  const posts = await prisma.post.findMany({
    select: {
      createdAt: true,
      user: {
        select: {
          generation: true,
        },
      },
    },
  });
  const users = await prisma.user.findMany({
    select: {
      createdAt: true,
    },
  });


  const ddd = parseKorea(new Date('2024-02-05'))

  let dateObj = {};

  for (const post of posts) {
    const date = parseKorea(post.createdAt);
    if (ddd.isBefore(date)) {
      const key = `${date.format('YYYYMMDD')}`;
      dateObj[key] = (dateObj[key] ?? 0) + 1;
    }
  }

  let userObj = {}
  for (const user of users) {
    const date = parseKorea(user.createdAt);
    if (ddd.isBefore(date)) {
      // const key = `${date.month() + 1}/${leftPad(date.date())}`;
      const key = `${date.format('YYYYMMDD')}`;
      userObj[key] = (userObj[key] ?? 0) + 1;
    }

  }


  return (
    <>
      <Graph label={'전체'} postCount={dateObj} userCount={userObj} leftDate={new Date('2024-02-05')}></Graph>
    </>
  );
}
