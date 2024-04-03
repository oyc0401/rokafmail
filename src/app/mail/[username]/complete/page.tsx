import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { User } from "src/db";
import styles from "./complete.module.css";
import { BasicFooter, Nav } from "src/components";

import {
  mailStartIsFuture,
  diffDay,
  getMailStart,
  getMailEnd,
} from "src/lib/time";
import { CheckCircle } from "public/assets/index";

///res?sc=200&searchName=곽희근&searchBirth=19950824&memberSeqVal=347938631
export default async function Complete({ searchParams, params }) {
  //const sc = searchParams.sc;
  const username = decodeURI(params.username);
  let user = await User.findByUsername(username);

  if (!user) {
    notFound();
  }

  // 전달 성공
  // 국방서버이슈
  // 유저x
  //

  let page = <Good name={user.name}></Good>;

  let helpAdditional = "";
  // 편지 시작 이전에 보냄
  if (mailStartIsFuture(user.generation)) {
    const start = getMailStart(user.generation);
    let diff = diffDay(start);
    page = <Later day={diff} name={user.name}></Later>;
    helpAdditional = `${start.format("YY.MM.DD")}부터 `;
  }

  return (
    <div className="screen">
      <div style={{ flex: 130 }}></div>

      <Image className={styles.icon} src={CheckCircle} alt="아이콘" />

      <div style={{ height: 28 }}></div>
      <h2 className="font-bold text-2xl">
        편지가 <br /> 전송되었습니다!
      </h2>
      <div style={{ flex: 28 }}></div>
      {page}
      <div style={{ flex: 160 }}></div>
      <p className={styles.intro}>
        {`${helpAdditional}편지함에서 비밀번호를 사용해 수정 및 삭제가 가능합니다.`}
      </p>
      <BasicFooter>
        <a className={`submit mini`} href={`/mails/${user.username}`}>
          편지함
        </a>
        <Link className={"submit"} href={`/mail/${user.username}`}>
          다시 작성하기
        </Link>
      </BasicFooter>
    </div>
  );
}

// 여러 텍스트 컴포넌트 만들기
function Good(props) {
  return (
    <p className="font-medium text-xl">
      1일 이내에 <span className={styles.name}>{props.name}</span> 훈련병에게
      <br />
      편지가 전달됩니다!
    </p>
  );
}

function Later(props) {
  return (
    <p className="font-medium text-xl">
      {props.day}일 뒤에 <span className={styles.name}>{props.name}</span>{" "}
      훈련병에게
      <br />
      편지가 전달됩니다!
    </p>
  );
}
