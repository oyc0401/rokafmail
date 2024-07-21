"use client";
import React, { useMemo, useState } from "react";
import styles from "./register.module.css";
import { useStoreBase } from "./model";
import { useRouter } from "next/navigation";
import { register, registerGoogle } from "src/server/apiAction/register";
import { action } from "src/lib/actionResponse";
import { sha256 } from "src/utils/sha256";
import { validateBirth, validateGeneration, validateMessage, validateName, validatePassword, validateUsername } from "src/utils/validate";
import { useSession } from "next-auth/react";

export function SendButton() {
  const router = useRouter();
  const { generation, name, birth, username, message } = useStoreBase();

  const canSubmit = useMemo(() => {
    try {
      validateMessage(message);
      validateGeneration(Number(generation));
      validateName(name);
      validateBirth(birth);
      validateUsername(username);
      return true;
    } catch (error) {
      return false;
    }
  }, [generation, name, birth, username, message]);

  const [progress, setProgress] = useState(false);

  const { data, status, update } = useSession();

  async function send() {

    const registerForm = {
      username: username,
      name: name,
      birth: birth,
      generation: Number(generation),
      message: message,
    }
    const uid = data?.user.uid;
    if (!uid) {
      alert(`회원가입 실패: userid 가 없습니다. 관리자에게 문의하세요`);
      return;
    }

    try {
      await action(registerGoogle(registerForm, uid));
      update({ username });
      window.onbeforeunload = null;
      router.push(`/register/link/${username}`);
    } catch (error) {
      if (error.status == 400) {
        alert(`회원가입 실패 ${error.message}`);
      } else {
        alert(error.message);
      }
    }
  }

  async function click(event) {
    event.preventDefault();
    if (!canSubmit) return;

    if (canSubmit) {
      setProgress(true);
      await send();
      setProgress(false);
    }
  }

  return (
    <>
      <div
        className={styles.registerLoad}
        style={{
          display: progress ? "flex" : "none",
        }}
      >
        <div className={`${styles.animation} ${styles.bigAnimation}`}></div>
      </div>
      <button
        className={canSubmit ? "submit" : "submit disable"}
        onClick={click}
        type="submit"
      >
        만들기
      </button>
    </>
  )
}
