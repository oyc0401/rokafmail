"use client";
import { useRouter } from "next/navigation";
import { deleteMail } from "src/server/apiAction/mails/delete";
import { useStore } from "./model";
import { validateContent, validateMailPassword, validateRelationship, validateTitle, validateWriter } from "src/utils/validate";
import { action } from "src/lib/actionResponse";
import { editPost } from "src/server/apiAction/mails/edit";

export function Submit({ postId, username, posted, url }) {
  const { name, relationship, title, contents, password, isPublic, selectedFiles, images } = useStore();

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

    const formData = new FormData();
    formData.append('postId', postId);
    formData.append('username', username);
    formData.append('name', name);
    formData.append('relationship', relationship);
    formData.append('title', title);
    formData.append('contents', contents);
    formData.append('password', password);
    formData.append('isPublic', isPublic.toString());
    images.forEach(file => {
      formData.append('images', file.id);
    });

    selectedFiles.forEach(file => {
      formData.append('files', file);
    });

    const result = await editPost(formData);

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
        alert("편지를 삭제했습니다.");
        // 삭제 후 메일 화면으로 돌아가기
        router.replace(`/mails/${username}`);
      } catch (error) {
        if (error.status == 401) {
          alert('잘못된 비밀번호 입니다.');
        } else if (error.status == 404) {
          alert('해당 편지가 이미 삭제되었습니다.');
        } else {
          alert(error.message);
        }
      }

    }
  }



  return (
    <>
      <footer className="container max-w-3xl mx-auto px-4">
        <div className="flex flex-row pt-2 sm:pt-3 pb-8">
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
