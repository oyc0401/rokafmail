"use client";
import React, { useMemo, useState } from "react";
import styles from "./register.module.css";
import { useStoreBase } from "./model";
import { useRouter } from "next/navigation";
import { register } from "src/server/apiAction/register";
import { action } from "src/lib/actionResponse";
import { sha256 } from "src/utils/sha256";
import { validateBirth, validateGeneration, validateMessage, validateName, validatePassword, validateUsername } from "src/utils/validate";

export function SendButton() {
  const router = useRouter();
  const { generation, name, birth, username, password, message } = useStoreBase();

  const canSubmit = useMemo(() => {
    try {
      validateMessage(message);
      validateGeneration(Number(generation));
      validateName(name);
      validateBirth(birth);
      validateUsername(username);
      validatePassword(password);
      return true;
    } catch (error) {
      return false;
    }
  }, [generation, name, birth, username, password, message]);

  const [progress, setProgress] = useState(false);

  async function send() {
    const encryptedPassword = sha256(password);

    const registerForm = {
      username: username,
      name: name,
      birth: birth,
      generation: Number(generation),
      message: message,
    }

    try {
      await action(register(registerForm, encryptedPassword));
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
