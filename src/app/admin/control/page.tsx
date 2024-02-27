"use client";
import Link from "next/link";
import { Button } from "@nextui-org/react";
import { verify, repost, findNotQueueNotpost } from "./server";
export default function Page() {
  return (
    <>
      <h2 className="font-bold text-2xl mb-2">Control</h2>
      <br></br>
      <br></br>
      <div>
        <Link
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline m-2"
          href={"/admin/control/user"}
        >
          유저 컨트롤 페이지
        </Link>
        <Link
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline m-2"
          href={"control/post"}
        >
          편지 컨트롤 페이지
        </Link>
        <br></br>
        <br></br>
        <br></br>
        <Button
          onClick={() => {
            if (confirm("모든 유저 재확인 작업을 수행하시겠습니까?")) verify();
          }}
        >
          모든 유저 재확인
        </Button>

        <br></br>
        <br></br>
        
        <Button
          onClick={() => {
            if (confirm("모든 편지 재전송 작업을 수행하시겠습니까?")) repost();
          }}
        >
          모든 편지 재전송
        </Button>

        <Button
          onClick={() => {
            if (confirm("findNotQueueNotpost?")) findNotQueueNotpost();
          }}
        >
          findNotQueueNotpost
        </Button>
        
      </div>
    </>
  );
}
