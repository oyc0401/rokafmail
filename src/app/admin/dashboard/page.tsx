import { Post, User } from "src/db";
import { InfoGraph } from './InfoGraph';
import { InfoAll } from "./InfoAll";

export default async function Page() {
  const userCount = await User.count();
  const activateUserCount = await User.activateCount();
  const postCount = await Post.count();

  const userCount855 = await User.generationCount(855);
  const postCount855 = await Post.generationCount(855);

  const userCount856 = await User.generationCount(856);
  const postCount856 = await Post.generationCount(856);

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

          <p className="text-xl pb-2">855기 유저: {userCount855}명 </p>
          <p className="text-xl pb-2">855기 편지: {postCount855}통</p>

          <p className="text-xl pb-2">856기 유저: {userCount856}명 </p>
          <p className="text-xl pb-2">856기 편지: {postCount856}통</p>
        </div>
        <InfoAll></InfoAll>
        <InfoGraph generation={856} leftDate={new Date('2024-03-11')}></InfoGraph>
        <InfoGraph generation={855} leftDate={new Date('2024-02-05')}></InfoGraph>

      </div>
    </>
  );
}
