import styles from "./NavHeader.module.css";

import localFont from 'next/font/local'
import DropdownButton from './DropdownButton';
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

export function NavHeader() {
  return (
    <nav role="banner" className={'shadow-sm dark:border-b dark:border-gray-800 w-full'}>
      <header className="max-w-3xl mx-auto px-2 ">
        <div className="flex justify-between items-center h-14">
          <div className="flex h-full px-2 mr-5 md:mr-0"><p className={`${sunBatang.className} ${styles.titleLogo}`}>하늘인편</p></div>
          <DropdownButton></DropdownButton>
        </div>

      </header>
    </nav>

  );
}
