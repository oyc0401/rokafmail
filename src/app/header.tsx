"use client";

import Link from "next/link";
import styles from "./main.module.css";
import { Nav } from "src/components";
import { useEffect, useState } from "react";

import { Logo, LogoTitle } from "public/assets/index";
import Image from "next/image";

export function Header() {
  const [height, setHeight] = useState(0);
  // const handleScroll = () => {
  //   const innerHeight = window.innerHeight;
  //   setHeight(innerHeight);
  //   console.log(innerHeight);
  // };

  useEffect(() => {
    const innerHeight = window.innerHeight;

    setHeight(innerHeight);
    return () => {
      // window.removeEventListener("scroll", handleScroll);
      // window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <div className={styles.top} style={height == 0 ? {} : { height: height }}>
      <div className="screen">
        <div style={{ flex: 90 }}></div>

        <div className="p-5">
          <Image className={styles.logo} src={Logo} alt="로고" />
          <div style={{ paddingTop: 38 }}>
            <Image className={styles.logoTitle} src={LogoTitle} alt="로고" />
          </div>
        </div>

        <div style={{ flex: 130 }}></div>

        <div className="pt-1 pb-8 w-full">
          <h3 className={styles.substring}>
            입대전에 인편 링크를
            <br />
            만들고 공유하세요!
          </h3>
        </div>
        <Link className="submit" href={{ pathname: "/register" }}>
          시작하기
        </Link>
        <div className="pt-2.5 pb-5 w-full">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <Link href="/search" className={styles.help}>
              편지함찾기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
