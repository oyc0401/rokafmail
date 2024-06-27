"use client";
import Image from "next/image";
import Link from "next/link";
import { CopyIcon } from "public/assets/index";

export function LinkButton({ url }) {
  function copy() {
    navigator.clipboard.writeText(url);
    alert(`링크가 복사되었습니다: ${url}`);
  }
  return (
    <>
      <div className="flex flex-row w-full">
        <div className="py-[14px] px-2 bg-[#F2F9FF] rounded-l-xl flex-1 flex flex-col justify-center">
          <Link href={url} className="text-sm break-all underline">
            {url}
          </Link>
        </div>
        <div className="bg-primary rounded-r-xl p-3 cursor-pointer" onClick={copy}>
          <Image className='h-full' src={CopyIcon} alt="복사" />
        </div>
      </div>

    </>
  )
}