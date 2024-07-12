"use client";
import { useRouter } from "next/navigation";
import { deleteMail } from "src/server/apiAction/mails/delete";
import { useStore } from "./model";
import { validateContent, validateMailPassword, validateRelationship, validateTitle, validateWriter } from "src/utils/validate";
import { action } from "src/server/actionResponse";
import { editPost } from "src/server/apiAction/mails/edit";

export function Submit({ postId, username, posted, url }) {
  const { name, relationship, title, contents, password, isPublic } = useStore();

  const router = useRouter();

  const canSubmit = () => {
    try {
      validateTitle(title);
      validateContent(contents);
      validateWriter(name);
      validateRelationship(relationship);
      validateMailPassword(password);
    } catch (e) {
      return false;
    }
    return true;
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
      try {
        await action(deleteMail(postId, password));
        if (posted) { // 기훈단에 발송 된 편지
          const isConfirm = confirm("편지가 삭제되었습니다.\n공군 기훈단 사이트에서도 해당 편지를 찾아 삭제해주십시오.\n확인을 누를시 해당 페이지로 이동합니다.");
          if (isConfirm) window.open(url);
        } else { // 내 DB에만 있는 편지
          alert("편지를 삭제했습니다.");
        }
        // 삭제 후 메일 화면으로 돌아가기
        router.replace(`/mails/${username}`);
      } catch (error) {
        if (error.status == 401) {
          alert('잘못된 비밀번호 입니다.');
        } else if (error.status == 404) {
          alert('해당 편지가 없습니다.');
        } else {
          alert(error.message);
        }
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
