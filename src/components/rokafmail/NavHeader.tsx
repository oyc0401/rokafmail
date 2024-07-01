import styles from "./NavHeader.module.css";

import localFont from 'next/font/local'
import DropdownButton from './NavHeaderDropdownButton';

const INKLIPQUID = localFont({
  src: [
    { path: '../../../public/fonts/INKLIPQUID_subset.ttf' },
  ]
})

export function NavHeader({ user }) {
  const { username, name, birth, memberSeq, connect } = user;
  return (
    <nav role="banner" className={'shadow-sm dark:border-b dark:border-gray-800 w-full'}>
      <header className="max-w-3xl mx-auto px-2 ">
        <div className="flex justify-between items-center h-14">
          <a className="flex h-full px-2 mr-5 md:mr-0" href="/">
            <p className={`${INKLIPQUID.className} ${styles.INKLIPQUID}`}>하늘인편</p>
          </a>
          <DropdownButton username={username} name={name} birth={birth} memberSeq={memberSeq} connect={connect}></DropdownButton>
        </div>

      </header>
    </nav>

  );
}
