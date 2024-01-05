import Link from "next/link";
import Image from "next/image";

import { getUser } from "src/server/";
import styles from "./complete.module.css";
import { Nav } from "src/components";

import { mailStartIsFuture, canPost, diffDay ,getMailStart} from "src/lib/time";
import { CheckCircle } from "public/assets/index";

///res?sc=200&searchName=곽희근&searchBirth=19950824&memberSeqVal=347938631
export default async function Complete({ searchParams, params }) {
  //const sc = searchParams.sc;
  console.log(params.username);
  let user = await getUser(params.username);

  if (!user) {
    notFound();
  }

  // 전달 성공
  // 국방서버이슈
  // 유저x
  //

  let page = <Good name={user.name}></Good>;

  // 편지 시작 이전에 보냄
  if (mailStartIsFuture(user.generation)) {
    const start = getMailStart(user.generation);
    let diff = diffDay(start);
    page = <Later day={diff} name={user.name}></Later>;
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
      <div style={{ flex: 182 }}></div>

      <Nav>
        <Link
          className={`submit mini`}
          href={`/mails/${user.username}`}
        >
          편지함
        </Link>
        <div style={{ width: 12 }}></div>
        <Link className={"submit"} href={`/mail/${user.username}`}>
          다시 작성하기
        </Link>
      </Nav>
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
