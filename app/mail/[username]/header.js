import airForceTime from "./time";
import styles from "./mail.module.css";
import { getUser } from "./server/getUser";

export async function Header(params) {
  let user = await getUser(params.username);

  // console.log(user);

  let name = user.name;
  let [start, end] = airForceTime(user.generation);
  let substring = user.substring;
  return (
    <>
      <h2 className='font-semibold text-2xl text-left w-full'>
        <span className="text-primary">{name}</span> 훈련병에게
        <br />
        편지를 보내주세요!
      </h2>
      <div style={{ height: 1 }}></div>
      <h2 className='text-gray-500 font-medium text-sm text-left w-full'>
        {start} ~ {end}
      </h2>
      <div style={{ height: 10 }}></div>
      <h2 className='font-semibold text-base text-left w-full'>{substring}</h2>
    </>
  );
}
