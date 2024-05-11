'use client'
import { useRouter } from "next/navigation";


export function TabBar({ username, active }) {
  const router = useRouter();
  return <div className="h-[56px] w-full flex p-1">
    <button
      onClick={() => router.replace(`/mails/${username}?page=complete`)}
      className={`w-full px-3 relative flex justify-center items-center cursor-pointer text-base ${active == 0 ? ' text-primary' : 'text-fontmedium hover:text-fontlight'}`}
    >
      전송 완료
      <span className={`absolute z-0 h-[2px] w-[80%] bottom-0 bg-primary rounded-none ${active == 0 ? '' : 'opacity-0'}`}></span>
    </button>
    <button
      onClick={() => router.replace(`/mails/${username}?page=wait`)}
      className={`w-full px-3 relative flex justify-center items-center cursor-pointer text-base ${active == 1 ? ' text-primary' : 'text-fontmedium hover:text-fontlight'}`}
    >
      전송 대기중
      <span className={`absolute z-0 h-[2px] w-[80%] bottom-0 bg-primary rounded-none ${active == 1 ? '' : 'opacity-0'}`}></span>
    </button>
  </div>
}