import '../styles/globals.css';

import Timer from './timer';

export const metadata = {
  title: '인편 지기',
  description: '공군 훈련병 인편 보내주기',
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