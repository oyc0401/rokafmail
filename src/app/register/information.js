"use client";
import styles from "./register.module.css";
import { useStore, useStoreBase } from "./model";
import { isContain, isDischarged } from "src/lib/time";

export default function Information() {
  const { generation, name, birth, setGeneration, setName, setBirth, next } =
    useStoreBase();

  function validG() {
    // 빈칸일 때
    if (generation == "") return { text: "예시) 850", valid: false };

    // 숫자가 아닌 다른문자 입력
    if (!/^\d+$/.test(generation))
      return { text: "숫자만 입력해주세요", color: "warn", valid: false };

    // 작성중
    if (generation < 100) return { text: "예시) 850", valid: false };

   
    if (isDischarged(generation))
      return { text: "이미 전역한 기수예요", color: "warn", valid: false };

    if (!isContain(generation))
      return { text: "입영기수가 아니예요", color: "warn", valid: false };

    // 통과
    return { text: "잘했어요!", color: "great", valid: true };
  }

  function validN() {
    // 빈칸일 때
    if (name == "") return { text: "", valid: false };

    // 통과
    return { text: "잘했어요!", color: "great", valid: true };
  }

  function validB() {
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
    return { text: "잘했어요!", color: "great", valid: true };
  }

  const canSubmit = () => validG().valid && validN().valid && validB().valid;

  const click = () => {
    if (canSubmit()) next();
  };

  return (
    <>
      <div style={{ flex: 100 }}></div>
      <h2 className={styles.title}>
        편지 주소를 확인하기 위해
        <br />
        이름과 생년월일이 필요해요
      </h2>

      <div style={{ flex: 49 }}></div>

      <p className={styles.formTitle}>기수</p>
      <div style={{ height: 2 }}></div>
      <input
        className={styles.form}
        value={generation}
        type="text"
        placeholder="기수를 입력해주세요 예시) 850"
        onChange={(e) => {
          setGeneration(e.target.value);
        }}
      ></input>
      <div style={{ height: 2 }}></div>
      <p className={`${styles.help} ${validG().color}`}>{validG().text}</p>

      <div style={{ height: 16 }}></div>

      <p className={styles.formTitle}>이름</p>
      <div style={{ height: 2 }}></div>
      <input
        className={styles.form}
        value={name}
        type="text"
        placeholder="이름을 입력해주세요"
        onChange={(e) => {
          setName(e.target.value);
        }}
      ></input>
      <div style={{ height: 2 }}></div>
      <p className={`${styles.help} ${validN().color}`}>{validN().text}</p>

      <div style={{ height: 16 }}></div>

      <p className={styles.formTitle}>생년월일</p>
      <div style={{ height: 2 }}></div>
      <input
        className={styles.form}
        value={birth}
        type="text"
        placeholder="생년월일 8자리를 입력해주세요"
        onChange={(e) => {
          setBirth(e.target.value);
        }}
      ></input>
      <div style={{ height: 2 }}></div>
      <p className={`${styles.help} ${validB().color}`}>{validB().text}</p>

      <div style={{ flex: 138 }}></div>
      <button
        className={canSubmit() ? "submit" : "submit disable"}
        onClick={click}
      >
        다음
      </button>
      <div style={{ height: 36 }}></div>
    </>
  );
}
