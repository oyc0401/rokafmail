import Link from "next/link";
import { NavHeaderHome } from "src/components";

import styles from "./page.module.css";
import { LoginButton, RegisterButton } from "./pageClient";
import { GoogleButton } from "src/components/SocialSignIn/GoogleButton";

export default function Page() {
  return (
    <>
      <TopView />
      <Body />
      <Footer />
    </>
  );
}

function TopView() {
  return (
    <>
      <NavHeaderHome></NavHeaderHome>
      <div className="max-w-2xl mx-auto flex flex-col px-4">
        <div className="pt-8 pb-12">
          <h1 className='text-2xl font-bold text-left' >
            <span className="text-primary">하늘인편</span>으로
            <br />
            인터넷 편지를 받아보세요
          </h1>
          <h2 className="text-xs text-fontmedium text-left pt-2">
            하늘인편은 편지를 쉽게 받을 수 있는
            <br />
            공군 인터넷편지 서비스입니다
          </h2>
        </div>
        <div className="py-4">
          <div className="max-w-xl py-4 px-1 bg-[#FAFAFA] text-sm mx-auto ">
            <h3 className="text-medium font-bold pb-3">하늘인편으로 인편 받는법!</h3>
            <p>1. 입대 전 SNS에 하늘인편 링크를 공유한다.</p>
            <p>2. 친구들이 링크를 보고 편지를 보낸다.</p>
            <p>3. 훈련소에서 인터넷편지를 받는다.</p>
          </div>
        </div>
        <div className="pt-8 pb-6 w-full">
          <p className="font-light text-base">
            저번 기수인 859기 중 734명이
            <br />
            하늘인편을 통해 편지를 받았습니다!
          </p>
        </div>
        <RegisterButton></RegisterButton>
        <div className="pt-4 pb-4 w-full">
          <div className="flex flex-row justify-center"          >
            <LoginButton></LoginButton>
          </div>
        </div>
      </div>
    </>
  );
}

function Body() {
  return (
    <>
      <div className="bg-gradient-to-t from-[#FAFAFA] pt-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="pb-6">
            <h3 className={styles.title} >
              사용방법
            </h3>
            <p className={styles.content}>
              입대 전에 하늘인편에 가입한 후 주변 사람들에게 링크를 공유하세요. 생성된 링크를 통해 접속하면 편지를 작성할 수 있습니다.  </p>
            <p className={styles.content}>
              내용은 최대 1200자까지 작성할 수 있으며 작성한 비밀번호를 통해 이후에 수정 및 삭제가 가능합니다.
            </p>
            <p className={styles.content}>
              입대 전에도 편지를 받을 수 있으며 로그인 후 받은 편지 내용을 확인할 수 있습니다.
            </p>
          </div>
        </div>
      </div>
      <div className="bg-[#FAFAFA] pb-14 px-4 ">
        <div className="max-w-2xl mx-auto">
          <div className="pb-6">
            <h3 className={styles.title} >
              편지 출력 안내
            </h3>
            <p className={styles.content}>
              2024년 8월 1일부로 공군에서 주말 휴대폰 사용, 네이버 BAND 활성화로 인해 인터넷편지를 출력해주지 않습니다.
            </p>
            <p className={styles.content}>
              대신 주말에 받는 휴대폰을 사용해 받은 편지들을 확인할 수 있습니다
            </p>
          </div>
          {/* <div className="pb-6">
            <h3 className={styles.title} >
              주의사항
            </h3>
            <p className={styles.content}>
              <strong> 가입 시 이름 및 생년월일을 정확히 입력해주세요!</strong>
              <br />
              훈련병을 식별할 수 없어 편지 발송이 불가능합니다
            </p>
          </div> */}
          <div className="pb-6">
            <h3 className={styles.title} >
              Q&A
            </h3>
            {/* <p className={`${styles.content} pb-2`}>
              <strong>훈련소에서 인편 출력해주나요?</strong>
              <br />
              2024년 8월 1일부로 공군에서 주말 휴대폰 사용, 네이버 BAND 활성화로 인해 인터넷편지를 출력해주지 않습니다.
            </p> */}
             <p className={`${styles.content} pb-2`}>
              <strong>꼭 입대전에 가입해야 하나요?</strong>
              <br />
              아닙니다. 훈련소 내부에서 주말 휴대폰 사용시간을 통해 가입하셔도 되고, 지인에게 대신 부탁해서 가입하셔도 됩니다.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function Footer() {
  return (
    <>
      <footer className='bg-primary pt-5 pb-8'>
        <div className="screen items-start gap-0.5">
          <div className="w-full flex justify-between">
            <p className='text-xs text-white'> 문의: oyc0401@gmail.com</p>
            <Link className='text-xs text-white underline' href="/search">
              편지함 찾기
            </Link>
          </div>
          <div className="w-full flex justify-between">
            <p className='text-xs text-white'>
              <span className='text-xs text-white'>© </span>
              <Link className='text-xs text-white underline'
                href="https://github.com/oyc0401" target="_blank" >
                yuchan
              </Link>
              <span className='text-xs text-white'>. All Rights Reserved.</span>
            </p>
            <Link className='text-xs text-white underline' href="/privacy-policy">
              개인정보처리방침
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}