import Link from "next/link";
import styles from "./footer.module.css";

export function Footer() {
  return (
    <div className={styles.footer}>
      <div className="screen" style={{ alignItems: "start" }}>
        

        <div className="flex w-full">
          <h3 className={styles.footerText}> 문의: oyc0401@gmail.com</h3>
          <div style={{ flex: 1 }}></div>
          <Link className={styles.footerLink} href="/search">
            편지함 찾기
          </Link>
        </div>
        

        <div className="flex w-full">
          <h3 className={styles.footerText}>
            <span>© </span>
            <Link
              className={styles.footerText}
              style={{ textDecorationLine: "underline" }}
              href={"https://github.com/oyc0401"}
            >
              yuchan
            </Link>
            <span>. All Rights Reserved.</span>
          </h3>
          <div style={{ flex: 1 }}></div>
          <Link className={styles.footerLink} href="/privacy-policy">
            개인정보처리방침
          </Link>
        </div>
      </div>
    </div>
  );
}
