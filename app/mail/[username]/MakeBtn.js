"use client";
import styles from "./page.module.css";
import { useStore } from "./model";
export function MakeBtn() {
  const { click } = useStore();
  if (click) {
    return <></>;
  }

  return (
    <div style={{ paddingTop: 18, paddingBottom: 8, width: "100%" }}>
      <button className={`submit ${styles.btn}`}>인편 만들기</button>
    </div>
  );
}
