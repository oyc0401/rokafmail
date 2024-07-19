'use client'
import GoogleIcon from 'public/icons/google_icon.png';
import Image from 'next/image';
import { signIn, useSession } from "next-auth/react";
import { redirect, useRouter } from 'next/navigation';
import { BasicLink } from 'src/components/BasicButton';

type Props = { children?; className?: string }

export function RegisterButton() {
  const { data, status } = useSession();
  if (status == 'authenticated' && data.user.username) {
    return (
      <BasicLink className="text-white bg-primary" href={{ pathname: `/mail/${data.user.username}` }}>
        내 인편함
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
  const { data } = useSession();

  async function onClick() {
    if (data?.user.provider == 'google') {
      router.replace(`/register`)
    } else {
      await signIn('google', { callbackUrl: '/register' });
    }
  }
  return (
    <div className={`rounded-full bg-primary w-full
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
    </div>
  )
}
export function IsAuthenticated({ children }) {

  const { data: session, status } = useSession();
  if (status === "authenticated" && session.user.username != undefined) {
    return children;
  }
  return undefined;
}

export function IsLoading({ children }) {

  const { data: session, status } = useSession()

  if (status === "loading") {
    return children;
  }

  return undefined;
}

export function IsNotAuthenticated({ children }) {

  const { data: session, status } = useSession()

  if (status === "unauthenticated") {
    return children;
  }
  if (status === "authenticated" && session.user.username == undefined) {
    return children;
  }

  return undefined;
}
export function LoginButton() {
  const { data: session, status } = useSession();

  if (status === "authenticated" && session.user.username != undefined) {
    return (
      <a href="/profile" className="text-base underline hover:text-darkaccent">내 정보</a>
    );
  }

  return (
    <>
      <span className="pr-2 text-base">이미 가입하셨으면?</span>
      <a href="/profile" className="text-base underline hover:text-darkaccent">로그인</a>
    </>
  )
}