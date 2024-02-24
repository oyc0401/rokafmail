import { Table } from "./table";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { useRouter } from "next/router";
import { Post, User } from "src/db";

const prismaStore = {
  user: prisma.user,
  user_queue: prisma.usersQueue,
  post: prisma.post,
  post_queue: prisma.postQueue,
  unc_post: prisma.unconnectedPost,
  unidentify: prisma.unidentifiedUser,
};

// export enum Store {
//   user,
//   user_queue,
//   post,
//   post_queue,
//   unc_post,
//   unidentify,
// }

export default async function LinkPage({ params }) {
  const tableName = params.table;
  // console.log(tableName);

  let data;

  switch (tableName) {
    case "post":
      data = await Post.findAllTable();
      break;
    case "user":
      data = await User.findAllTable();
      break;
    default:
      data = await prismaStore[tableName].findMany();
  }

  //console.log(Store[tableName])

  // console.log(toJson(data))
  return (
    <>
      <div className="mx-auto p-4">
        <Table data={data} tableName={tableName}></Table>
      </div>
    </>
  );
}