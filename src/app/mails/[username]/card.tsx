"use client";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import styles from "./mails.module.css";
///res?sc=200&searchName=곽희근&searchBirth=19950824&memberSeqVal=347938631
import { Menu } from "@headlessui/react";
import { useRouter } from 'next/navigation'

export function DropDownCard({ id, title, name, rel, time,username }) {
  const router = useRouter()

  // const onDelete = async () => {
  //   var password = prompt("편지 삭제를 위해 비밀번호를 입력해주세요.", "");

  //   if(password){
  //     const result = await deletePost(id, password);

  //     if (result) {
  //       alert("편지를 삭제했습니다.");
  //       router.refresh();
  //     } else {
  //         alert("잘못된 비밀번호 입니다.");
  //     }
  //   }
    
  // };

  function moveView(){
    router.push(`/mails/${username}/${id}`);
  }
  return (
    <Dropdown>
      <DropdownTrigger>
        <div className={styles.card}>
          <p className="text-left text-lg">{title}</p>
          <div className="sized" style={{ height: 4 }}></div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <p>{`${name} | ${rel}`}</p>
            <div style={{ flex: 1 }}></div>
            <p>{time}</p>
          </div>
        </div>
      </DropdownTrigger>
      <DropdownMenu>
        {/* <DropdownItem key="new">New file</DropdownItem>
      <DropdownItem key="copy">Copy link</DropdownItem>
      <DropdownItem key="edit">Edit file</DropdownItem> */}
        <DropdownItem
          key="delete"
          className=""
       
          onClick={moveView}
        >
          열기
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export function Card({ title, name, rel, time }) {
  return (
    <div className={styles.card}>
      <p className="text-left text-lg">{title}</p>
      <div className="sized" style={{ height: 4 }}></div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <p>{`${name} | ${rel}`}</p>
        <div style={{ flex: 1 }}></div>
        <p>{time}</p>
      </div>
    </div>
  );
}

function MyDropdown() {
  return (
    <Menu>
      <Menu.Button>More</Menu.Button>
      <Menu.Items>
        <Menu.Item>
          {({ active }) => (
            <a
              className={`${active && "bg-blue-500"}`}
              href="/account-settings"
            >
              Account settings
            </a>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <a
              className={`${active && "bg-blue-500"}`}
              href="/account-settings"
            >
              Documentation
            </a>
          )}
        </Menu.Item>
        <Menu.Item disabled>
          <span className="opacity-75">Invite a friend (coming soon!)</span>
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
}
