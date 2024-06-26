"use client";
import Image from "next/image";

import { CopyIcon } from "public/assets/index";

export function CopyButton({ url }) {
  function copy() {

    navigator.clipboard.writeText(url);
    alert(`링크가 복사되었습니다! ${url}`);
  }

  return (
    <div onClick={copy}>
      <Image className='ml-2' src={CopyIcon} alt="복사" />
    </div>
  );
}
