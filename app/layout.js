import '../styles/globals.css';
import { Noto_Sans_KR } from 'next/font/google'; // @next/font will be removed in next14
import { ReactNode } from 'react';
import Timer from './timer';

const notoSansKr = Noto_Sans_KR({
  weight: ['400', '500', '600', '700', '800'],
  preload: false,
  display: 'swap',
})



export const metadata = {
  title: '인편 지기',
  description: '공군 훈련병 인편 보내주기',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko-KR" className={notoSansKr.className}>
      <body>
        {/* <Timer /> */}
        {children}
      </body>
    </html>
  )
}