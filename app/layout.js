import '../styles/globals.css';
import localFont from 'next/font/local'
import { ReactNode } from 'react';
import Timer from './timer';


const notoSansKr = localFont({
  src: [
    {
      path: './font/NotoSansKR-Thin.ttf',
      weight: '100',
       style: 'normal',
    },
    {
      path: './font/NotoSansKR-ExtraLight.ttf',
      weight: '200',
       style: 'normal',
    },
    {
      path: './font/NotoSansKR-Light.ttf',
      weight: '300',
       style: 'normal',
    },
    {
      path: './font/NotoSansKR-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './font/NotoSansKR-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './font/NotoSansKR-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: './font/NotoSansKR-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: './font/NotoSansKR-ExtraBold.ttf',
      weight: '800',
      style: 'normal',
    },
    {
      path: './font/NotoSansKR-Black.ttf',
      weight: '900',
      style: 'normal',
    },

  ],
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