'use client'

import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import MenuIcon from "public/assets/menuIcon.svg";
import Image from "next/image";
export default function DropdownButton() {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button isIconOnly size="sm" variant="light">
          <Image className={''} src={MenuIcon} alt="메뉴" />

        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem className="text-left" key="new">편지 작성</DropdownItem>
        <DropdownItem className="text-left" key="copy">받은 편지함</DropdownItem>
        <DropdownItem className="text-left" key="edit">공유하기</DropdownItem>
        <DropdownItem className="text-left" key="edit" showDivider>기훈단 사이트</DropdownItem >
        <DropdownItem className="text-left" key="dev-info" showDivider>
          하늘인편 소개
        </DropdownItem>
        <DropdownItem className="text-left" key="login">
          로그인
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}