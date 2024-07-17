'use client'
import GoogleIcon from 'public/icons/google_icon.png';
import Image from 'next/image';
import { signIn, useSession } from "next-auth/react";
import { redirect, useRouter } from 'next/navigation';
import { BasicLink } from 'src/components/BasicButton';

type Props = { children?; className?: string }

export function RegisterButton() {
  const { data, status, update } = useSession();
  if (status == 'authenticated' && data.user.username) {
    return (
      <BasicLink className="text-white bg-primary" href={{ pathname: "/register" }}>
        인편 작성
      </BasicLink>
    )
  }
  return (
    <BasicLink className="text-white bg-primary" href={{ pathname: "/register" }}>
      회원가입
    </BasicLink>
  )

}

export function GoogleButton({ children, className }: Props) {

  const router = useRouter();
  const { data, status, update } = useSession();
 
  async function onClick() {
    if (data?.user.provider == 'google') {
      router.replace(`/register`)
    } else {
      await signIn('google', { callbackUrl: '/register' });
    }


  }



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

export function UpdateSession() {
  const { data, status, update } = useSession();

  function click() {
    update({ username: 'google' });
  }
  return <button onClick={click}>업데이트</button>
}