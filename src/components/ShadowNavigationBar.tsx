"use client";
import styles from "./ShadowNavigationBar.module.css";
import { useEffect, useState } from "react";

// 바닥으로 내려가면 그림자가 사라지는 네비게이션 바
export function ShadowNavigationBar({ children, elevation = false }) {
  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const innerHeight = window.innerHeight;
    // console.log(`${scrollHeight} / ${scrollTop} / ${innerHeight}`);

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
      <nav
        className={`fixed bottom-0 w-full bg-white ${!elevation ? "" : end ? "" : styles.end
          }`}
      >
        <footer className="container max-w-3xl mx-auto px-4">
          <div className="row pt-3 pb-9">
            {children}
          </div></footer>
      </nav>
    </>
  );
}
