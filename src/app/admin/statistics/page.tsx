import { Post, User } from "src/db";
import { InfoGraph } from './InfoGraph';

export default async function Page() {
  const userCount = await User.count();
  const activateUserCount = await User.activateCount();
  const postCount = await Post.count();

  const userCount858 = await User.generationCount(858);
  const postCount858 = await Post.generationCount(858);

  const userCount859 = await User.generationCount(859);
  const postCount859 = await Post.generationCount(859);

  return (
    <>
      <div>
        <h2 className="font-bold text-2xl mb-2">DashBoard</h2>

        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
          <p className="text-xl pb-2">유저: {userCount}명</p>
          <p className="text-xl pb-2">
            편지를 받은 유저: {activateUserCount} 명
          </p>

          <p className="text-xl pb-2">편지 수: {postCount}통</p>

          <p className="text-xl pb-2">858기 유저: {userCount858}명 </p>
          <p className="text-xl pb-2">858기 편지: {postCount858}통</p>

          <p className="text-xl pb-2">859기 유저: {userCount859}명 </p>
          <p className="text-xl pb-2">859기 편지: {postCount859}통</p>
        </div>
        <InfoGraph generation={859} leftDate={new Date('2024-06-24')}></InfoGraph>
        <InfoGraph generation={858} leftDate={new Date('2024-05-20')}></InfoGraph>
      </div>
    </>
  );
}
