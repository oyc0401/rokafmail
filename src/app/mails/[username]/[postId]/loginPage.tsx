"use client";
import { useState } from "react";
import styles from "./page.module.css";
import { checkPassword } from "./cookie";
import { Nav } from "src/components";
import {
  InputField,
  BasicFormArea,
  BasicHeader,
  BasicBody,
  BasicFooter,
} from "src/components";
export function LoginPage({ postId }) {
  const [pw, setPw] = useState("");
  const [message, setMessage] = useState("");

  function validP() {
    // 빈칸일 때
    if (pw == "") return { text: "", valid: false };

    // 짧을 때
    if (pw.length < 4)
      return {
        text: "비밀번호는 4자리 이상이여야 합니다",
        color: "warn",
        valid: false,
      };

    // 통과
    return { text: "", color: "great", valid: true };
  }

  async function click() {

    const result = await checkPassword(postId, pw);

    if (!result) {
      alert('비밀번호가 틀렸습니다.');
    }
  }

  function canSubmit() {
    return validP().valid;
  }

  return (
    <BasicFormArea>
      <BasicHeader>
        편지를 작성할 때 입력한
        <br />
        비밀번호를 입력해주세요
      </BasicHeader>
      <BasicBody>
        <InputField
          label="비밀번호"
          placeholder="비밀번호를 입력해주세요"
          type="password"
          onChange={(t) => {
            setPw(t);
            setMessage("");
          }}
          helpMessage={message}
          color={"warn"}
        />
      </BasicBody>
      <BasicFooter>
        <button className="submit" type="submit" onClick={click}>
          편지 열기
        </button>
      </BasicFooter>

    </BasicFormArea>
  );

  // return (
  //   <div className="screen">
  //     <div style={{ flex: 100 }}></div>
  //     <h2 className={styles.title}>
  //       편지를 작성할 때 작성한
  //       <br />
  //       비밀번호를 입력해주세요
  //     </h2>
  //     <div style={{ height: 49 }}></div>

  //     <p className={styles.formTitle}>비밀번호</p>
  //     <div style={{ height: 2 }}></div>
  //     <input
  //       className={styles.form}
  //       type="password"
  //       placeholder="비밀번호를 입력해주세요"
  //       onChange={(e) => {
  //         setPw(e.target.value);
  //         setMessage("");
  //       }}
  //     ></input>
  //     <div style={{ height: 2 }}></div>
  //     <p className={`${styles.help}`}>{message}</p>
  //     <div style={{ flex: 340 }}></div>

  //     <Nav>
  //       <button
  //         className={canSubmit() ? "submit" : "submit disable"}
  //         onClick={click}
  //       >
  //         편지 열어보기
  //       </button>
  //     </Nav>
  //   </div>
  // );
}
