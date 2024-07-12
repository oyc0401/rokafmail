import Image from 'next/image';
import Link from 'next/link';
import RokafSmall from 'public/assets/rokaf-small.png';

export function PostCard({ id, title, name, rel, time, username, contents, isPublic }) {
  return (
    <div className='mt-2.5 mx-4'>
      <Link href={`/mails/${username}/${id}`}>
        <div className='cursor-pointer bg-[#FFFDF8] active:opacity-75 p-4 shadow-sm rounded max-w-3xl '>

          <div className="flex flex-row justify-between space-x-2">
            <p className="text-left text-base font-medium mb-1.5 line-clamp-2 text-ellipsis">{title}</p>
            <Image className="w-10 h-4" src={RokafSmall} alt='공군마크' ></Image>
          </div>

          {isPublic ? <p className="text-left text-sm mb-2 line-clamp-2" >{contents}</p> : <></>}
          <div className="flex flex-row justify-between items-end space-x-2 mt-0.5">
            <p className="text-sm">{`${name} | ${rel}`}</p>
            <p className="text-xs">{time}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}

export function PostSkeletonCard() {
  return (
    <div className='mt-2.5 mx-4'>
      <div className='cursor-pointer bg-[#FFFDF8] active:opacity-75 p-4 shadow-sm rounded max-w-3xl '>
        <div className="flex flex-row justify-between space-x-2">
          <div className="bg-[#F5F3EE] mb-1.5 h-6 w-48 rounded"></div>
        </div>
        <div className="flex flex-row justify-between items-end space-x-2 mt-0.5">
          <div className="bg-[#F5F3EE] h-5 w-28 rounded"></div>
          <div className="bg-[#F5F3EE] h-5 w-16 rounded"></div>
        </div>
      </div>
    </div>
  );
}