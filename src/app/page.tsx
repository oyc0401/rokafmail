import Link from "next/link";
import { NavHeaderHome } from "src/components";

import styles from "./page.module.css";
import { IsAuthenticated, IsLoading, IsNotAuthenticated } from "src/components";

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
          <div className="max-w-xl py-4 px-1 bg-[#FAFAFA] text-sm mx-auto">
            <h3 className="text-medium font-bold pb-3">하늘인편으로 인편 받는법!</h3>
            <p>1. 입대 전 SNS에 하늘인편 링크를 공유한다.</p>
            <p>2. 친구들이 링크를 보고 편지를 보낸다.</p>
            <p>3. 훈련소에서 인터넷편지를 받는다.</p>
          </div>
        </div>
        <div className="pt-8 pb-6 w-full">
          <p className="font-light text-base">
            현재 병 858기 중 672명이
            <br />
            하늘인편을 통해 편지를 받았습니다!
          </p>
        </div>
        <Link className="submit" href={{ pathname: "/register" }}>
          편지함 생성하기
        </Link>
        <div className="pt-4 pb-5 w-full">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <IsAuthenticated>
              <a href="/profile" className="text-base underline hover:text-darkaccent">내 정보</a>
            </IsAuthenticated>
            <IsNotAuthenticated>
              <span className="pr-2 text-base">이미 가입하셨으면?</span>
              <a href="/profile" className="text-base underline hover:text-darkaccent">로그인</a>
            </IsNotAuthenticated>
            <IsLoading>
              <span className="pr-2 text-base"> 이미 가입하셨으면?</span>
              <a href="/profile" className="text-base underline hover:text-darkaccent">로그인</a>
            </IsLoading>
          </div>
        </div>
      </div>
    </>
  );
}

function Body() {
  return (
    <div className="max-w-2xl mx-auto pt-8 pb-14 px-4">
      <div className="pb-8">
        <h3 className={styles.title} >
          훈련소 내 편지 발송
        </h3>
        <p className={styles.content}>
          공군 훈련소에서 훈련 3주차부터 수료 전까지 인쇄된 편지를 받을 수 있습니다.
        </p>
        <p className={styles.content}>
          하늘인편에서 훈련 3주차 이전에 작성한 편지는 모아두었다가 이후부터 순차적으로 발송됩니다.
        </p>
        <p className={styles.content}>
          일일 편지 전송 제한으로 인해 일부 편지는 추후에 받아볼 수 있습니다.
        </p>
      </div>

      <div className="pb-8">
        <h3 className={styles.title} >
          사용방법
        </h3>
        <p className={styles.content}>
          입대 전에 편지함을 만들고 주변 사람들에게 링크를 공유합니다.
        </p>
        <p className={styles.content}>
          링크를 통해 접속하면 편지를 작성할 수 있습니다. 내용은 최대 1200자까지 작성할 수 있으며 작성한 비밀번호를 통해 이후에 수정 및 삭제가 가능합니다.
        </p>
        <p className={styles.content}>
          입대 전에도 편지를 받을 수 있으며 내 정보에서 받은 편지 내용을 확인할 수 있습니다.
        </p>
      </div>

      <div className="pb-8">
        <h3 className={styles.title} >
          주의사항
        </h3>
        <p className={styles.content}>
          <strong> 가입 시 이름 및 생년월일을 정확히 입력해주세요!</strong>
          <br />
          훈련병을 식별할 수 없어 편지 발송이 불가능합니다
        </p>
      </div>
      <div className="pb-8">
        <h3 className={styles.title} >
          Q&A
        </h3>
        <p className={styles.content}>
          <strong>꼭 입대전에 가입해야 하나요?</strong>
          <br />
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