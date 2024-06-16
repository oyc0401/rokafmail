import Link from "next/link";
import Image from "next/image";
import localFont from 'next/font/local'
import { Logo } from "public/assets/index";
import { FitScreen } from "src/components/FitScreen";

import styles from "./page.module.css";
import { IsAuthenticated, IsLoading, IsNotAuthenticated } from "src/components";

const INKLIPQUID = localFont({ src: '../../public/fonts/INKLIPQUID.ttf' });

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
    <FitScreen>
      <div className="h-full max-w-3xl mx-auto flex flex-col px-4">
        <div style={{ flex: 90 }}></div>
        <div className="p-5">
          <Image className='h-40 w-40 mx-auto' src={Logo} alt="로고" />
          <div style={{ paddingTop: 38 }}>
            <h2 className={`${INKLIPQUID.className} ${styles.titleLogo}`}>
              하늘인편
            </h2>
          </div>
        </div>

        <div style={{ flex: 130 }}></div>

        <div className="pt-1 pb-8 w-full">
          <h1 className={'text-xl'}>
            입대전에 인편 링크를
            <br />
            만들고 공유하세요!
          </h1>
        </div>
        <Link className="submit" href={{ pathname: "/register" }}>
          편지함 만들기
        </Link>
        <div className="pt-2.5 pb-5 w-full">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <a href="/profile" className={`text-base underline hover:text-darkaccent`}>
              <IsAuthenticated>내 정보</IsAuthenticated>
              <IsNotAuthenticated>로그인</IsNotAuthenticated>
              <IsLoading>로그인</IsLoading>
            </a>
          </div>
        </div>
      </div>
    </FitScreen>
  );
}

function Body() {
  return (
    <div className="max-w-3xl mx-auto pb-14 px-4">
      <div className="pt-14 pb-8">
        <h2 className='text-2xl font-bold pb-4 text-left font-bold' >
          하늘인편으로
          <br />
          손쉽게 편지를 받아보세요
        </h2>
        <p className='text-base text-left'>
          하늘인편은 편지를 쉽게 받을 수 있는
          <br />
          공군 인터넷편지 서비스입니다
        </p>
      </div>
      <div className="pb-8">
        <h2 className='text-2xl font-bold pb-4 text-left font-bold' >
          사용방법
        </h2>
        <p className='text-base text-left pb-2.5'>
          입대 전에 편지함을 만들어 주변 사람들에게 링크를 공유합니다.
        </p>
        <p className='text-base text-left pb-2.5'>
          링크를 통해 접속하면 편지를 작성할 수 있습니다. 내용은 최대 1200자까지 작성할 수 있으며 작성한 비밀번호를 통해 이후에 수정 및 삭제가 가능합니다.
        </p>
        <p className='text-base text-left'>
          입대 전에도 편지를 받을 수 있으며 내 정보에서 받은 편지 내용을 확인할 수 있습니다.
        </p>
      </div>
      <div className="pb-8">
        <h2 className='text-2xl font-bold pb-4 text-left font-bold' >
          훈련소 내 편지 발송
        </h2>
        <p className='text-base text-left pb-2.5'>
          공군 훈련소에서는 훈련 3주차부터 수료 전까지 인쇄된 편지를 받을 수 있습니다.
        </p>
        <p className='text-base text-left pb-2.5'>
          하늘인편에서 3주차 이전에 작성한 편지는 모아두었다가 이후부터 순차적으로 발송됩니다.
        </p>
        <p className='text-base text-left'>
          일일 편지 전송 제한으로 인해 일부 편지는 추후에 받을 수 있습니다.
        </p>
      </div>
      <div className="pb-8">
        <h2 className='text-2xl font-bold pb-4 text-left font-bold' >
          주의사항
        </h2>
        <p className='text-base text-left'>
          <strong> 가입 시 이름 및 생년월일을 정확히 입력해주세요!</strong>
          <br/>
          훈련병을 식별할 수 없어 편지 발송이 불가능합니다
        </p>
      </div> 
      <div className="pb-8">
        <h2 className='text-2xl font-bold pb-4 text-left font-bold' >
          Q&A
        </h2>
        <p className='text-base text-left'>
          <strong>꼭 입대전에 가입해야 하나요?</strong>
          <br/>
          아닙니다. 훈련소 내부에서 주말 휴대폰 사용시간을 통해 가입하셔도 되고, 지인에게 대신 부탁해서 가입하셔도 됩니다.
        </p>
      </div> 
      
    </div>
  );
}

function Footer() {
  return (
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
  );
}