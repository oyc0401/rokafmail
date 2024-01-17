import "styles/globals.css";
import { Noto_Sans_KR } from "next/font/google";

const notoSansKr = Noto_Sans_KR({
  weight: ["400", "500", "600", "700", "800"],
  preload: false,
  display: 'fallback',
  fallback: ['Noto Sans KR', "sans-serif"],
});

export const metadata = {
  title: "하늘인편",
  description: "공군 인편지기 사이트",
};

export default function RootLayout({ children }) {
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
