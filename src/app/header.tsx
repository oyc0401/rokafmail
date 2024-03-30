"use client";

import Link from "next/link";
import styles from "./main.module.css";
import { Nav } from "src/components";
import { useEffect, useState } from "react";

import { Logo, LogoTitle } from "public/assets/index";
import Image from "next/image";
import localFont from 'next/font/local'

// Font files can be colocated inside of `pages`
const sunBatang = localFont({
  src: [
    {
      path: '../../public/fonts/SunBatang-Light.ttf',
      weight: '300',
    },
    {
      path: '../../public/fonts/SunBatang-Medium.ttf',
      weight: '500',
    },
    {
      path: '../../public/fonts/SunBatang-Bold.ttf',
      weight: '700',
    },
  ],
})

// export function Header() {
//   // if (typeof window !== "undefined") {
//   //   innerHeight = window.innerHeight;
//   // }
//   // const innerHeight = window.innerHeight;


//   return (
//     <div className={styles.top} style={{ height: innerHeight }}>

export function Header() {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const innerHeight = window.innerHeight;
    setHeight(innerHeight);
  }, []);

  return (
    <div className={styles.top} style={height == 0 ? {} : { height: height }}>
      <div className="screen">
        <div style={{ flex: 90 }}></div>

        <div className="p-5">
          <Image className={styles.logo} src={Logo} alt="로고" />
          <div style={{ paddingTop: 38 }}>
            <h2 className={`${sunBatang.className} ${styles.titleLogo}`}>
              하늘인편
            </h2>
          </div>
        </div>

        <div style={{ flex: 130 }}></div>

        <div className="pt-1 pb-8 w-full">
          <h1 className={'text-xl'}>
            입대전에 인편 링크를
            <br />
            만들고 공유하세요!
          </h1>
        </div>
        <Link className="submit" href={{ pathname: "/register" }}>
          편지함 만들기
        </Link>
        <div className="pt-2.5 pb-5 w-full">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <Link href="/profile" className={styles.help}>
              로그인
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
