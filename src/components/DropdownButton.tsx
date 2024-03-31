'use client'

import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import MenuIcon from "public/assets/menuIcon.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
export default function DropdownButton({ username, name, birth,memberSeq, connect }) {
  const router = useRouter();
  const url = `https://www.airforce.mil.kr/user/indexSub.action?codyMenuSeq=156893223&siteId=last2&menuUIType=top&dum=dum&command2=getEmailList&searchName=${name}&searchBirth=${birth}&memberSeq=${memberSeq}`;

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
        {/* <DropdownItem className="text-left" key="edit">공유하기</DropdownItem> */}
        {connect ? <DropdownItem className="text-left" key="rokaf" onClick={() => window.open(url)} showDivider>기훈단 사이트</DropdownItem > : null}
 
        {/* <DropdownItem className="text-left" key="dev-info" showDivider>
          하늘인편 소개
        </DropdownItem> */}
        {/* <DropdownItem className="text-left" key="login">
          로그인
        </DropdownItem> */}
      </DropdownMenu>
    </Dropdown>
  );
}