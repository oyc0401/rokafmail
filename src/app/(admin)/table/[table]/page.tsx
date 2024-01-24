import { Table } from "./table";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const prismaStore = {
  user: prisma.user,
  user_queue: prisma.usersQueue,
  post: prisma.post,
  post_queue: prisma.postQueue,
  unc_post: prisma.unconnectedPost,
  unidentify:prisma.unidentifiedUser,
};

export default async function LinkPage({ params }) {
  const tableName = params.table;
  console.log(tableName);

  const data = await prismaStore[tableName].findMany();

  console.log(toJson(data))
  return (
    <>
      <div className=" mx-auto p-4">
        <Table data={data} tableName={tableName}></Table>
      </div>
    </>
  );
}

function toJson(text) {
  return JSON.parse(JSON.stringify(text));
}
