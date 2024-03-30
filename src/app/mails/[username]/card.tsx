"use client";
import { useRouter } from 'next/navigation'
import RokafSmall from 'public/assets/rokaf-small.png';
import Image from 'next/image';

export function PostCard({ id, title, name, rel, time, username, contents, secret }) {
  const router = useRouter();
  const moveView = () => router.push(`/mails/${username}/${id}`);

  return (
    <>
      <div className='cursor-pointer bg-[#FFFDF8] mt-2.5 mx-4 p-4 shadow rounded max-w-3xl' onClick={moveView}>
        <div className="flex flex-row justify-between space-x-2">
          <p className="text-left text-base font-medium mb-1.5 line-clamp-2 text-ellipsis">{title}</p>
          <Image className="w-10 h-4" src={RokafSmall} alt='공군마크' ></Image>
        </div>

        {secret ? <></> : <p className="text-left text-sm mb-2 line-clamp-2" >{contents}</p>}
        <div className="flex flex-row justify-between space-x-2 mt-0.5">
          <p className="text-xs">{`${name} | ${rel}`}</p>
          <p className="text-xs">{time}</p>
        </div>
      </div>
    </>
  );
}