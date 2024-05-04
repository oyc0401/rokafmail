'use client'

import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import MenuIcon from "public/assets/menuIcon.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IsAuthenticated } from "./IsAuthenticated";
import { IsNotAuthenticated } from "./IsNotAuthenticated";
import { IsLoading } from "./IsLoading";
import { useSession } from "next-auth/react";
export default function DropdownButton({ username, name, birth, memberSeq, connect }) {
  const router = useRouter();
  const { data: session, status } = useSession();

  const rokafUrl = `https://www.airforce.mil.kr/user/indexSub.action?codyMenuSeq=156893223&siteId=last2&menuUIType=top&dum=dum&command2=getEmailList&searchName=${name}&searchBirth=${birth}&memberSeq=${memberSeq}`;

  function profileDropdownItem() {
    if (status === "authenticated") {
      return <DropdownItem className="text-left" key="profile"
        onClick={() => router.push(`/profile`)}>내 정보</DropdownItem>
    }

    return <DropdownItem className="text-left" key="profile"
      onClick={() => router.push(`/auth/signin?callbackUrl=${window.location.href}`)}>로그인</DropdownItem>
  }

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button isIconOnly size="sm" variant="light">
          <Image className={''} src={MenuIcon} alt="메뉴" />

        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem className="text-left" key="mail" onClick={() => router.push(`/mail/${username}`)}>편지 작성</DropdownItem>

        <DropdownItem className="text-left" key="mails" onClick={() => router.push(`/mails/${username}`)}>받은 편지함</DropdownItem>
        {profileDropdownItem()}

        {connect ? <DropdownItem className="text-left" key="rokaf" onClick={() => window.open(rokafUrl)}>기훈단 사이트</DropdownItem >
          : <DropdownItem className="p-0"></DropdownItem>}

      </DropdownMenu>
    </Dropdown>
  );
}


