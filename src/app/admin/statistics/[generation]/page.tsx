import dayjs from "dayjs";
import { Post, User } from "src/db";
import prisma from "src/db/prisma"
import { DateChart } from "./dateChart";
import { dbSelectionToObj, objToList } from "./chart";
import { Period, fromGeneration, week } from "./period";



export default async function Page({ params }) {
  const generation = Number(params.generation);
  const userCount = await User.generationCount(generation);
  const postCount = await Post.generationCount(generation);


  const users = await prisma.user.findMany({
    select: { id: true, createdAt: true },
    where: { generation: generation }
  });
  const posts = await prisma.post.findMany({
    select: { id: true, createdAt: true },
    where: { user: { generation: generation } }
  });

  const userObj = dbSelectionToObj(users);
  const postObj = dbSelectionToObj(posts);

  
  const period = fromGeneration(generation, 9);

  const userData = objToList(userObj, period);
  const postData = objToList(postObj, period);

  return (
    <>
      <div>
        <h2 className="font-bold text-2xl mb-2">DashBoard</h2>
      
        <p className="text-xl pb-2">{generation}기 유저: {userCount}명 </p>
        <DateChart data={userData} />

        <p className="text-xl pb-2">{generation}기 편지: {postCount}건</p>
        <DateChart data={postData} />
      </div>
    </>
  );
}
