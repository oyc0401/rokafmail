import "styles/globals.css";
import { Noto_Sans_KR } from "next/font/google";
import { init } from "./init";

const notoSansKr = Noto_Sans_KR({
  weight: ["400", "500", "600", "700", "800"],
  preload: false,
  display: "fallback",
  fallback: ["Noto Sans KR", "sans-serif"],
});

export const metadata = {
  title: "공군 인터넷편지 하늘인편",
  description:
    "공군 훈련병에게 인터넷편지를 보내주는 사이트입니다. 입대전 미리 링크를 만들어 사람들에게 공유하세요.",
  keywords: ["공군", "인편", "인편지기", "인터넷편지"],
  applicationName: "하늘인편",
  openGraph: {
    title: "하늘인편",
    description: "링크를 눌러 편지를 작성해주세요",
    siteName: "하늘인편",
    locale: "ko-KR",
    type: "website",
    url: "http://rokafmail.kr",
  },
};

export default function RootLayout({ children }) {
  init();
  return (
    <html lang="ko-KR" className={notoSansKr.className}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
