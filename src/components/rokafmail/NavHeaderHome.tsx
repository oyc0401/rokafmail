import styles from "./NavHeader.module.css";

import localFont from 'next/font/local'

const INKLIPQUID = localFont({
  src: [
    { path: '../../../public/fonts/INKLIPQUID_subset.ttf' },
  ]
})

export function NavHeaderHome() {
  return (
    <nav role="banner" className={'shadow-sm dark:border-b dark:border-gray-800 w-full'}>
      <header className="max-w-3xl mx-auto px-2 ">
        <div className="flex justify-between items-center h-14">
          <a className="flex h-full px-2 mr-5 md:mr-0" href="/">
            <p className={`${INKLIPQUID.className} ${styles.INKLIPQUID}`}>하늘인편</p>
          </a>
        </div>
      </header>
    </nav>

  );
}
