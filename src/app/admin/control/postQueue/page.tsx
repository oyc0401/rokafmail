
import prisma from "src/db/prisma";
import { DatabaseTable } from "./Table";

export default async function UserController({ searchParams }) {
  if (searchParams.userId) {
    const data = await prisma.postQueue.findMany({
      where: {
        user: {
          NOT: {
            sodae: null,
            memberSeq: null,
          },
        },
      },
      include: {
        user: true,
        post: {
          include: {
            user: {
              select: {
                username: true,
                generation: true,
                memberSeq: true,
                sodae: true,
                id: true,
              },
            },
          }
        }
      },
    });

    const transformedArray = data.map((item) => {
      // 각 객체에 대해 user와 post 속성을 해체하여 상위 객체에 통합
      return {
        ...item,
        ...item.user,
      };
    });
    return (
      <>
        <h2 className="font-bold text-2xl mb-4">{`PostQueue - user id:${searchParams.userId}`}</h2>
        <DatabaseTable key={"1"} data={transformedArray}></DatabaseTable>
      </>
    );
  }

  const data = await prisma.postQueue.findMany({
    where: {

      user: {
        NOT: {
          sodae: null,
          memberSeq: null,
        },
      },
    },
    include: {
      user: false,
      post: {
        include: {
          user: {
            select: {
              username: true,
              generation: true,
              memberSeq: true,
              sodae: true,
              id: true,
            },
          },
        }
      }
    },
  });

  const transformedArray = data.map((item) => {
    // 각 객체에 대해 user와 post 속성을 해체하여 상위 객체에 통합

    return {
      ...item.post.user,
      ...item.post,
      ...item,
    };
  });

  return (
    <>
      <h2 className="font-bold text-2xl mb-4">{`PostQueue`}</h2>
      <DatabaseTable key={"2"} data={transformedArray}></DatabaseTable>
    </>
  );
}
