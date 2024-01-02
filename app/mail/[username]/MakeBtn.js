"use client";
import styles from "./page.module.css";
import { useStore } from "./model";
import Link from "next/link";
export function MakeBtn() {
  const { click } = useStore();
  

  return (
    <div style={{ paddingTop: 18, paddingBottom: 6, width: "100%" }}>
      <Link
        className={`submit ${styles.btn}`}
        style={click ? { visibility: "hidden" } : { display: "visible" }}
        href={{ pathname: "/" }}
      >
        인편 만들기
      </Link>
    </div>
  );
}
