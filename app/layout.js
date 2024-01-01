import '../styles/globals.css';
import { Noto_Sans_KR } from 'next/font/google';

const notoSansKr = Noto_Sans_KR({
  weight: ['400', '500', '600', '700', '800'],
  preload: false,
 // display: 'auto',
  fallback: ['system-ui', 'sans-serif']
})



export const metadata = {
  title: '인편 지기',
  description: '공군 훈련병 인편 보내주기',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko-KR" className={notoSansKr.className}>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
      </head>
      <body className='screen'>
        {children}
      </body>
    </html>
  )
}