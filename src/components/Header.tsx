import styles from "./Header.module.css";

import localFont from 'next/font/local'

// Font files can be colocated inside of `pages`
const sunBatang = localFont({
  src: [
    {
      path: '../../public/fonts/SunBatang-Light.ttf',
      weight: '300',
    },
    {
      path: '../../public/fonts/SunBatang-Medium.ttf',
      weight: '500',
    },
    {
      path: '../../public/fonts/SunBatang-Bold.ttf',
      weight: '700',
    },
  ],
})

export function Header({ children }) {
  return (
    <p className={`${sunBatang.className}`}>하늘인편</p>
  );
}
