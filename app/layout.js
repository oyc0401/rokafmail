import '../styles/globals.css';

import Timer from './timer';

export const metadata = {
  title: '오유찬 인편',
  description: '공군 훈련병 오유찬 화이팅',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko-KR">
      <body>
        {/* <Timer /> */}
        {children}
      </body>
    </html>
  )
}