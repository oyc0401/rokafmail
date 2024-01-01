"use client";
import styles from "./components.module.css";
import Link from "next/link";
import { throttle } from "lodash";
import { useEffect, useState } from "react";

export function Nav({ children }) {
  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
   // console.log(`${scrollHeight} / ${clientHeight} / ${scrollTop}`);
       setRender(`${scrollHeight} / ${clientHeight} / ${scrollTop}`)
    
    if (scrollTop + clientHeight + 1+50 >= scrollHeight) {
      setEnd(true);
    } else {
      setEnd(false);
    }
  };

  
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);
  
  const [end, setEnd] = useState(true);
  const [, setRender] = useState("");

  return (
    <>
      <div style={{ height: 108,minHeight:108,width:1 }}></div>
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
