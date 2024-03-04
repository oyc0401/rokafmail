"use client";

import { getEnter, getCompletion } from "src/lib/time";

export function CopyButton({ url, name, generation }) {
  function copy() {
    const startTime = getEnter(generation).format("YY.MM.DD");

    const endTime = getCompletion(generation).format("YY.MM.DD");
    const isMobile = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );
    };
    if (isMobile() && navigator.share) {
      navigator
        .share({
          title: "하늘인편",
          text: `${name} 훈련병에게 힘이 되는 편지를 보내주세요`,
          url: url,
        })
        .then(() => console.log("공유 성공"))
        .catch((error) => console.log("공유 실패", error));
    } else {
      navigator.clipboard.writeText(url);
      alert(`링크가 복사되었습니다!`);
    }
  }

  return (
    <button className={"submit"} onClick={copy}>
      링크 공유
    </button>
  );
}
