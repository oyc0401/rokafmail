'use client'
import GoogleIcon from 'public/icons/google_icon.png';
import Image from 'next/image';
import { signIn, useSession } from "next-auth/react";

type Props = { children?; className?: string }

export function GoogleButton({ children, className }: Props) {
  async function onClick() {
    const response = await signIn('google', { callbackUrl: '/register' });
  }

  const { data, status, update } = useSession();
  console.log('session:', data);

  return (
    <button className={`rounded-full bg-primary w-full
    cursor-pointer active:opacity-75 bg-white border-2 border-[#DEE2E6] px-4 ${className}`}
      onClick={onClick}
    >
      <div className='flex flex-row items-center'>
        <Image className="w-[22px] h-[22px]" src={GoogleIcon} alt='구글 아이콘' ></Image>
        <div className='flex-1 py-3'>
          {children}
        </div>
        <div className="w-[22px] h-[22px]"></div>
      </div>
    </button>
  )
}