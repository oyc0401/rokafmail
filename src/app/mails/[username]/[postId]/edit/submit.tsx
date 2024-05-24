"use client";
import { useRouter } from "next/navigation";
import { deletePost } from "src/app/api/mails/mail";

import { useStore } from "./model";
import { validN, validR, validC, validT, validP } from "./valid";
import { editPost } from "./api";

export function Submit({ postId, username, posted, url }) {
  const { name, relationship, title, contents, password, isPublic } = useStore();

  const router = useRouter();

  const canSubmit = () => {
    return validN(name).valid &&
      validR(relationship).valid &&
      validT(title).valid &&
      validC(contents).valid &&
      validP(password).valid;
  }

  async function click() {
    const result = await editPost({ postId, username, name, relationship, title, contents, password, isPublic });

    if (result == '수정완료') {
      router.replace(`/mails/${username}/${postId}`);
    } else {
      alert(result);
    }
  }

  async function onDelete() {
    const password = prompt("편지 삭제를 위해 비밀번호를 입력해주세요.", "");

    if (password) {
      const response = await deletePost(postId, password);

      if (response.status == 200) {
        if (posted) {
          // 이미 발송된 편지
          const isConfirm = confirm(
            "편지가 삭제되었습니다.\n공군 기훈단 사이트에서도 해당 편지를 찾아 삭제해주십시오.\n확인을 누를시 해당 페이지로 이동합니다.",
          );
          if (isConfirm) {
            window.open(url);
          }
        } else {
          // 미발송 편지
          alert("편지를 삭제했습니다.");
          router.replace(`/mails/${username}`);
        }
      } else {
        alert(response.error);
      }
    }
  }


  return (
    <>
      <footer className="container max-w-3xl mx-auto px-4">
        <div className="row pt-2 sm:pt-3 pb-8">
          <button className={`submit mini hidden glxfd:block`} style={{ background: 'red' }} onClick={onDelete}>
            삭제
          </button>
          <button
            className={canSubmit() ? "submit" : "submit disable"}
            onClick={click}
          >
            수정
          </button>
        </div>
      </footer>

    </>
  );
}
