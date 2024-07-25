'use client'
import { useSession } from "next-auth/react";
import Link from "next/link";
import { GoogleButton } from "src/components/SocialSignIn/GoogleButton";


export function RegisterButton() {
  const { data: session, status } = useSession();

  if (status == 'loading') {
    return (
      <Link className="submit smallText" href={{ pathname: "/register" }}>
        회원가입
      </Link>
    );
  }

  if (status == 'authenticated' && session.user.username) {
    return (
      <Link className="submit smallText" href={{ pathname: `/mail/${session.user.username}` }}>
        내 인편함
      </Link>
    )
  }
  return (
    <>
      <GoogleButton className="mb-3" callbackUrl='/register' >
        구글로 계속하기
      </GoogleButton>
      <Link className="submit smallText" href={{ pathname: "/register" }}>
        회원가입
      </Link>
    </>

  )

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
      <a href="/auth/signin" className="text-base underline hover:text-darkaccent">로그인</a>
    </>
  )
}