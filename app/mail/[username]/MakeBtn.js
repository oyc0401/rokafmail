"use client";
import styles from "./page.module.css";
import { useStore } from "./model";
import Link from "next/link";
export function MakeBtn() {
  const { click } = useStore();
  if (click) {
    return <></>;
  }

  return (
    <div style={{ paddingTop: 18, paddingBottom: 8, width: "100%" }}>
      <Link className={`submit ${styles.btn}`} href={{ pathname: "/" }}>
        인편 만들기
      </Link>
    </div>
  );
}
