import "styles/globals.css";
import { Noto_Sans_KR } from "next/font/google";
import Providers from "./provider";
import { GoogleAnalytics } from '@next/third-parties/google'

const notoSansKr = Noto_Sans_KR({
  weight: ["400", "500", "700"],
  preload: false,
  display: "swap", // swap으로 해야 입력시 안깨짐
  //subsets: ['latin'],
  fallback: ["휴먼엽서체", "sans-serif"],
});

export const metadata = {
  title: "하늘인편 - 공군 인터넷편지",
  description: "하늘인편: 공군 인편을 가장 쉽게 받을 수 있는 서비스. 입대 전 하늘인편 링크를 공유하고, 훈련소에서 편지를 받아보세요.",
  keywords: ["공군 인편", "공군 인편지기", "공군 인터넷편지", "공군 인편 받는법", "공군 인편지기 양식"],
  applicationName: "하늘인편",
  metadataBase: new URL(`https://${process.env.DOMAIN}`),
  openGraph: {
    title: "하늘인편",
    description: "하늘인편: 공군 인편을 가장 쉽게 받을 수 있는 서비스",
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
        <meta name="google-adsense-account" content="ca-pub-3948063339127452" />
      </head>
      <GoogleAnalytics gaId="G-BZ21V7LF0V" />
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
