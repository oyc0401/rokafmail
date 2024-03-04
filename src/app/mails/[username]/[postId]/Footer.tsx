"use client";

import { useRouter } from "next/navigation";
import { deletePost } from "./server";
import Link from "next/link";

export function Footer({ postId, username, posted, url }) {
  const router = useRouter();

  const onDelete = async () => {
    var password = prompt("편지 삭제를 위해 비밀번호를 입력해주세요.", "");

    if (password) {
      const result = await deletePost(postId, password);

      if (result) {
        if (posted) {
          // 이미 발송된 편지
          let isConfirm = confirm(
            "편지가 삭제되었습니다.\n공군 기훈단 사이트에서도 해당 편지를 찾아 삭제해주십시오.\n확인을 누를시 해당 페이지로 이동합니다.",
          );
          if (isConfirm) {
            window.open(url);
          }
        } else {
          // 미발송 편지
          alert("편지를 삭제했습니다.");
          router.back();
        }
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
        <button
          className={`submit mini`}
          style={{ background: "red" }}
          onClick={onDelete}
        >
          삭제하기
        </button>
        <Link className={"submit"} href={`/mails/${username}`}>
          편지함
        </Link>
      </div>
    </div>
  );
}
