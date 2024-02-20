"use client";

import { useRouter } from "next/navigation";
import { deletePost } from "./server";
import Link from "next/link";

export function Footer({ postId,username }) {
  const router = useRouter();

  const onDelete = async () => {
    var password = prompt("편지 삭제를 위해 비밀번호를 입력해주세요.", "");

    if (password) {
      const result = await deletePost(postId, password);

      if (result) {
        alert("편지를 삭제했습니다.");
        router.back();
      } else {
        alert("잘못된 비밀번호 입니다.");
      }
    }
  };

  return (
    <div
      style={{
        paddingTop: 12,
        paddingBottom: 36,
        width: "100%",
      }}
    >
      <div className="row">
        <button className={`submit mini`} onClick={onDelete}>
          삭제하기
        </button>
        <div style={{ width: 12 }}></div>
        <Link className={"submit"} href={`/mails/${username}`}>편지함</Link>
      </div>
    </div>
  );
}
