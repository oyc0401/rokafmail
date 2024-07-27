'use client'
import styles from "./NavHeader.module.css";

import localFont from 'next/font/local'
import DropdownButton from './NavHeaderDropdownButton';

const INKLIPQUID = localFont({
  src: [
    { path: '../../../public/fonts/INKLIPQUID_subset.ttf' },
  ]
})

interface UserProps { username: string }

export function NavHeader({ user }: { user?: UserProps }) {

  function DropDown() {
    if (user) {
      return <DropdownButton username={user.username} />
    }
    return <DropdownButton />
  }
  return (
    <>
      <div className="h-[56px]"></div>
      <nav role="banner" className={'fixed top-0 left-0 bg-white shadow-sm dark:border-b dark:border-gray-800 w-full'}>
        <header className="max-w-3xl mx-auto px-2 ">
          <div className="flex justify-between items-center h-14">
            <a className="flex h-full px-2 mr-5 md:mr-0" href="/">
              <p className={`${INKLIPQUID.className} ${styles.INKLIPQUID}`}>하늘인편</p>
            </a>
            <DropDown></DropDown>
          </div>

        </header>
      </nav>
    </>

  );
}
