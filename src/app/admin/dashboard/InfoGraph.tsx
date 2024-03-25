
import { Graph } from './Graph';
import { parseKorea } from "src/lib/time";
import prisma from "src/db/prisma"
function leftPad(value: number) {
  if (value >= 10) {
    return value;
  }
  return `0${value}`;
}

export async function InfoGraph({ generation, leftDate }) {

  const posts = await prisma.post.findMany({
    select: {
      createdAt: true,
      user: {
        select: {
          generation: true,
        },
      },
    },
    where: {
      user: {
        generation: generation,
      }
    }
  });
  const users = await prisma.user.findMany({
    select: {
      createdAt: true,
    },
    where: {
      generation: generation,
    }
  });


  const ddd = parseKorea(leftDate)

  let dateObj = {};

  for (const post of posts) {
    const date = parseKorea(post.createdAt);
    //if (ddd.isBefore(date)) {
    const key = `${date.format('YYYYMMDD')}`;
    dateObj[key] = (dateObj[key] ?? 0) + 1;
    // }
  }

  let userObj = {}
  for (const user of users) {
    const date = parseKorea(user.createdAt);
    // if (ddd.isBefore(date)) {
    const key = `${date.format('YYYYMMDD')}`;
    userObj[key] = (userObj[key] ?? 0) + 1;
    //  }

  }


  return (
    <>
      <Graph label={generation} postCount={dateObj} userCount={userObj} leftDate={leftDate}></Graph>
    </>
  );
}
