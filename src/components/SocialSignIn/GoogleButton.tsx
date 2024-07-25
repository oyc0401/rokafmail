'use client'
import GoogleIcon from 'public/icons/google_icon.png';
import Image from 'next/image';
import { signIn, useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';

type Props = { children?; className?: string, callbackUrl?: string }

export function GoogleButton({ children, className, callbackUrl }: Props) {

  const router = useRouter();
  const { data } = useSession();

  async function onClick() {
    if (data?.user.provider != 'google') {
      await signIn('google', { callbackUrl: callbackUrl ?? '/register' });
    } else {
      router.replace(callbackUrl ?? `/register`)
    }
  }

  return (
    <div className={`rounded-xl bg-primary w-full
    cursor-pointer active:opacity-80 bg-white border-2 border-[#DEE2E6] px-4 ${className}`}
      onClick={onClick}
    >
      <div className='flex flex-row items-center'>
        <Image className="w-[22px] h-[22px]" src={GoogleIcon} alt='구글 아이콘' ></Image>
        <div className='flex-1 py-3'>
          {children}
        </div>
        <div className="w-[22px] h-[22px]"></div>
      </div>
    </div>
  )
}