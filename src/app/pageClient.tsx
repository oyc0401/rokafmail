'use client'
import { useSession } from "next-auth/react";
import { BasicLink } from 'src/components/BasicButton';


export function RegisterButton() {
  const { data: session, status } = useSession();
  if (status == 'authenticated' && session.user.username) {
    return (
      <BasicLink className="text-white bg-primary" href={{ pathname: `/mail/${session.user.username}` }}>
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