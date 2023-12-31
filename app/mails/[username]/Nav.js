"use client";
import styles from "./mails.module.css";
import Link from "next/link";
import { throttle } from "lodash";
import { useEffect, useState } from "react";

export function Nav({ children }) {
  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    console.log(`${scrollHeight} / ${clientHeight} / ${scrollTop} `);
    setScroll(`${scrollHeight} / ${clientHeight} / ${scrollTop} `);
    if (scrollTop + clientHeight + 1+50 >= scrollHeight) {
      console.log("끝!!!");
      setEnd(true);
    } else {
      setEnd(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);
  const [end, setEnd] = useState(false);
  const [scroll, setScroll] = useState("");
  const isScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
  
    const clientHeight = document.documentElement.clientHeight;

    return scrollHeight>clientHeight+51;
  };

  return (
    <>
      <div style={{ height: 108 }}></div>
      <div className={`${styles.footer} ${end?"":styles.end}`}>
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
