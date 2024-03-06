"use client";
import { useState } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import crypto from "crypto";
// import { setCookie } from "./cookie";
import { Nav } from "src/components";
import { login } from "src/app/api/login/login";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { knowTime, isDischarged } from "src/lib/time";
import {
  getProfile,
  deleteUser,
  editProfile,
} from "src/app/api/profile/profile";
import { useEffect, useRef } from "react";

export function Client({ username, name, birth, message }) {
  const [nameForm, setName] = useState(name);
  const [birthForm, setBirth] = useState(birth);
  const [messageForm, setmessage] = useState(message);
  const canSubmit = () =>
    validM(messageForm).valid &&
    validN(nameForm).valid &&
    validB(birthForm).valid;

  const router = useRouter();

  const click = async () => {
    try{
      const response = await editProfile(
        username,
        nameForm,
        birthForm,
        messageForm,
      );
      console.log(response)
      if (response.status == 200) {
        router.push("/profile");
        router.refresh();
      }
    }catch(error){
      console.log(error.message)
    }
    
  };

  return (
    <div className="screen">
      <div style={{ flex: 64 }}></div>
      <div className="pt-12 pb-8 w-full">
        <h2 className={styles.title}>
          정보 수정
          <br />
        </h2>
      </div>

      <div style={{ flex: 12 }}></div>

      <div className="pb-4 w-full">
        <p className={styles.formTitle}>이름</p>
        <div style={{ height: 2 }}></div>
        <input
          className={styles.form}
          value={nameForm}
          type="text"
          placeholder="이름을 입력해주세요"
          onChange={(e) => {
            setName(e.target.value);
          }}
        ></input>
        <div style={{ height: 2 }}></div>
        <p className={`${styles.help} ${validN(nameForm).color}`}>
          {validN(nameForm).text}
        </p>
      </div>

      <div className="pb-4 w-full">
        <p className={styles.formTitle}>생년월일</p>
        <div style={{ height: 2 }}></div>
        <input
          className={styles.form}
          value={birthForm}
          type="text"
          placeholder="생년월일 8자리를 입력해주세요"
          onChange={(e) => {
            setBirth(e.target.value);
          }}
        ></input>
        <div style={{ height: 2 }}></div>
        <p className={`${styles.help} ${validB(birthForm).color}`}>
          {validB(birthForm).text}
        </p>
      </div>

      <div className="pb-4 w-full">
        <p className={styles.formTitle}>메시지</p>
        <div style={{ height: 2 }}></div>
        <input
          className={styles.form}
          value={messageForm}
          type="text"
          placeholder="메시지를 입력해주세요"
          onChange={(e) => {
            setmessage(e.target.value);
          }}
        ></input>
        <div style={{ height: 2 }}></div>
        <p className={`${styles.help} ${validM(messageForm).color}`}>
          {validM(messageForm).text}
        </p>
      </div>

      <div style={{ flex: 90 }}></div>
      <div className="pb-8 pt-6 w-full">
        <button
          className={canSubmit() ? "submit" : "submit disable"}
          onClick={click}
        >
          수정하기
        </button>
      </div>
    </div>
  );
}

function validM(message) {
  // 빈칸일 때
  if (message == "") return { text: "", valid: false };

  // 너무 많을 때
  if (50 < message.length)
    return { text: "글이 너무 길어요", color: "warn", valid: false };

  // 통과
  return { text: "", color: "great", valid: true };
}

function validN(name) {
  // 빈칸일 때
  if (name == "") return { text: "", valid: false };

  // 통과
  return { text: "", color: "great", valid: true };
}

function validB(birth) {
  // 빈칸일 때
  if (birth == "") return { text: "예시) 20020101", valid: false };

  // 숫자가 아닌 문자 입력
  if (!/^\d+$/.test(birth))
    return { text: "숫자만 입력해주세요.", color: "warn", valid: false };

  // 8자리 미만
  if (birth.length < 8) return { text: "예시) 20020101", valid: false };

  // 8자리 초과
  if (birth.length > 8)
    return {
      text: "생년월일 8자리를 입력해주세요",
      color: "warn",
      valid: false,
    };

  // 통과
  return { text: "예시) 20020101", valid: true };
}
