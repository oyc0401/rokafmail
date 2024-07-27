"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { validateContent, validateMailPassword, validateRelationship, validateTitle, validateWriter } from "src/utils/validate";
import styles from "./page.module.css";
import { useStore } from "./model";
import { action } from "src/lib/actionResponse";
import { sendMail } from "src/server/apiAction/mail";
import uploadFile from "./pupload";


export function Submit({ username }) {
  const { name, relationship, title, contents, password, isPublic, selectedFiles } = useStore();

  const router = useRouter();

  const [progress, setProgress] = useState(false);

  const canSubmit = () => {
    try {
      validateContent(contents);
      validateTitle(title);
      validateMailPassword(password);
      validateRelationship(relationship);
      validateWriter(name);
    } catch (e) {
      return false;
    }
    return true;
  }

  async function postMail() {
    setProgress(true);






    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('name', name);
      formData.append('relationship', relationship);
      formData.append('title', title);
      formData.append('contents', contents);
      formData.append('password', password);
      formData.append('isPublic', isPublic.toString());
      selectedFiles.forEach(file => {
        formData.append('files', file);
      });
      // const sendForm = {
      //   username: username,
      //   name: name,
      //   relationship: relationship,
      //   title: title,
      //   contents: contents,
      //   password: password,
      //   isPublic: isPublic,
      // }

      await action(sendMail(formData));
      handleUpload();
      // alert('편지 전송 성공!');
      router.push(`/mail/${username}/complete`);
    } catch (error) {
      if (error.status == 404) {
        alert(`해당 유저가 없습니다.`);
      } else {
        alert(`오류발생, 편지 전송 실패 ${error}`);
      }
    }
    setProgress(false);
  }

  async function click() {
    const canpost = canSubmit();
    if (canpost) {
      postMail()

    } else {
      try {
        validateTitle(title);
        validateContent(contents);
        validateWriter(name);
        validateRelationship(relationship);
        validateMailPassword(password);
      } catch (e) {
        alert(e.message);
      }

    }
  }

  function Loading() {
    return (
      <div
        className={styles.registerLoad}
        style={{
          display: progress ? "flex" : "none",
        }}
      >
        <div className={`${styles.animation} ${styles.bigAnimation}`}></div>
      </div>
    );
  }

  const handleUpload = async () => {
    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('files', file);
    });

    await uploadFile(formData);
  };

  return (
    <>
      {/* <div className="flex-1"></div> */}
      <footer className="container max-w-3xl mx-auto px-4">
        <div className="flex flex-row pt-2 sm:pt-3 pb-8">
          <a className={`submit mini hidden glxfd:block`} href={`/mails/${username}`}>
            편지함
          </a>
          <button
            className={canSubmit() ? "submit" : "submit disable"}
            onClick={click}
          >
            전송하기
          </button>
        </div>
      </footer>
      <Loading></Loading>
    </>
  );
}
