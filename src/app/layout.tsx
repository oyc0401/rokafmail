import "styles/globals.css";
import { Noto_Sans_KR } from "next/font/google";
import Providers from "./provider";

const notoSansKr = Noto_Sans_KR({
  weight: ["400", "500", "600", "700", "800"],
  preload: false,
  display: "fallback",
  fallback: ["Noto Sans KR", "sans-serif"],
});

export const metadata = {
  title: "하늘인편 - 공군 인편",
  description:
    "하늘인편은 공군 인편을 보내주는 사이트입니다. 입대 전 미리 링크를 만들어 사람들에게 공유하세요. 이젠 가족과 친구에게 인편지기를 부탁할 필요가 없습니다. 하늘인편이 인편지기가 되어드립니다. 또한 하늘인편은 입대 후 즉시 편지작성이 가능해서 더 많은 편지를 받아볼 수 있습니다.",
  keywords: ["공군", "인편", "인편지기", "인터넷편지"],
  applicationName: "하늘인편",
  metadataBase: new URL(`https://${process.env.DOMAIN}`),
  openGraph: {
    title: "하늘인편",
    description: "링크를 눌러 편지를 작성해주세요",
    siteName: "하늘인편",
    locale: "ko-KR",
    type: "website",
    url: "https://rokafmail.kr",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko-KR" className={`${notoSansKr.className} light`}>
      <head>
        <meta
          name="google-site-verification"
          content="daf22BPVkbTY82jmuxh9x3rsm38fZpTGdt0sl9o7mm8"
        />
        <meta
          name="naver-site-verification"
          content="1b4f09dac96624b20134a08b4d3884618caaf21f"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
