'use client'

import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, DropdownSection } from "@nextui-org/react";
import MenuIcon from "public/assets/menuIcon.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { signOut, useSession } from "next-auth/react";

export default function DropDownButton({ username }: { username?: string }) {
  const router = useRouter();
  const { data: session, status } = useSession();

  function getUserMenu() {
    if (username) {
      return (
        <DropdownSection showDivider>
          <DropdownItem className="text-left" key="mail" onClick={() => router.push(`/mail/${username}`)}>편지 작성</DropdownItem>
          <DropdownItem className="text-left" key="mails" onClick={() => router.push(`/mails/${username}`)}>받은 편지함</DropdownItem>
          <DropdownItem className="text-left" key="image" onClick={() => window.open(`https://www.airforce.mil.kr/user/indexSub.action?codyMenuSeq=156893231&siteId=last2&menuUIType=sub`)}>훈련병 사진</DropdownItem>
        </DropdownSection >
      );
    }
    return (
      <DropdownSection className="p-0 m-0">
        <DropdownItem className="p-0 m-0"></DropdownItem>
      </DropdownSection >
    );
  }

  function profiles() {
    if (status === "authenticated" && session.user.username) {
      return (
        <DropdownSection showDivider>
          <DropdownItem className="text-left" key="profile"
            onClick={() => router.push(`/profile`)}>내 정보</DropdownItem>
          <DropdownItem className="text-left" key="myMail" onClick={() => router.push(`/mail/${session.user.username}`)}>내 편지함</DropdownItem>
          <DropdownItem className="text-left" key="profile"
            onClick={() => signOut({ callbackUrl: '/' })}>로그아웃</DropdownItem>
        </DropdownSection>
      )
    } else {
      return (
        <DropdownSection showDivider>
          <DropdownItem className="text-left" key="login"
            onClick={() => router.push(`/auth/signin?callbackUrl=${window.location.href}`)}>로그인</DropdownItem>
          <DropdownItem className="text-left" key="register"
            onClick={() => router.push(`/register`)}>회원가입</DropdownItem>
        </DropdownSection>
      )
    }
  }


  return (
    <Dropdown>
      <DropdownTrigger>
        <Button isIconOnly size="sm" variant="light">
          <Image src={MenuIcon} alt="메뉴" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        {getUserMenu()}
        {profiles()}
        <DropdownSection>
          <DropdownItem className="text-left" key="report" onClick={() => router.push(`/report?url=${window.location.href}`)}>문의사항</DropdownItem>
          <DropdownItem className="text-left" key="privacy-policy" onClick={() => router.push(`/privacy-policy`)}>개인정보처리방침</DropdownItem>
          <DropdownItem className="text-left" key="developer" onClick={() => window.open(`https://github.com/oyc0401`)}>개발자 정보</DropdownItem>
        </DropdownSection>

      </DropdownMenu>

    </Dropdown>
  );
}


