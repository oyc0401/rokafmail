"use client";
import styles from "./components.module.css";
import { useEffect, useState } from "react";

// 바닥으로 내려가면 그림자가 사라지는 네비게이션 바
export function Nav({ children, elevation = false }) {
  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const innerHeight = window.innerHeight;
    // console.log(`${scrollHeight} / ${clientHeight} / ${scrollTop}`);

    // setLog(`${scrollHeight} / ${innerHeight} / ${scrollTop + innerHeight}`);
    if (scrollTop + innerHeight + 1 >= scrollHeight) {
      setEnd(true);
    } else {
      setEnd(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const [end, setEnd] = useState(true);
  // const [log, setLog] = useState("");

  return (
    <>
      <div style={{ height: 108, minHeight: 108, width: 1 }}></div>
      <div
        className={`${styles.footer} ${
          !elevation ? "" : end ? "" : styles.end
        }`}
      >
        {/* <p style={{ height: 30 }}>{log}</p> */}

        <div
          style={{
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 12,
            paddingBottom: 36,
          }}
        >
          <div className="row">{children}</div>
        </div>
      </div>
    </>
  );
}
