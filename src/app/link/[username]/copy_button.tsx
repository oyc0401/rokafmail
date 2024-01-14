"use client";

export function CopyButton({ url }) {
  function copy() {
    navigator.clipboard.writeText(url);
    alert("복사되었습니다!");
  }

  return (
    <button className={"submit"} onClick={copy}>
      링크 복사
    </button>
  );
}
