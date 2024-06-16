import "styles/globals.css";
import { Noto_Sans_KR } from "next/font/google";
import Providers from "./provider";
import { GoogleAnalytics } from '@next/third-parties/google'


const notoSansKr = Noto_Sans_KR({
  weight: ["400", "500", "600", "700", "800"],
  preload: false,
  display: "fallback",
  fallback: ["Noto Sans KR", "sans-serif"],
});

export const metadata = {
  title: "하늘인편 - 공군 인터넷편지",
  description:
    "하늘인편으로 손쉽게 공군 인편을 받을 수 있어요. ① 입대 전 SNS에 하늘인편 링크를 공유한다. ② 친구들이 링크를 보고 편지를 보낸다. ③ 훈련소에서 인터넷편지를 받는다!",
  keywords: ["공군", "인편", "인터넷편지"],
  applicationName: "하늘인편",
  metadataBase: new URL(`https://${process.env.DOMAIN}`),
  openGraph: {
    title: "하늘인편",
    description: "편리한 공군 인터넷편지 서비스",
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
        <meta name="google-adsense-account" content="ca-pub-3948063339127452"/>
      </head>
       <GoogleAnalytics gaId="G-BZ21V7LF0V" />
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
