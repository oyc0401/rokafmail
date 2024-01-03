import Link from "next/link";
import { getUser } from "src/server/";
import styles from "./complete.module.css";

import { getMailStart, canPost, diffDay } from "src/lib/time";

///res?sc=200&searchName=곽희근&searchBirth=19950824&memberSeqVal=347938631
export default async function Complete({ searchParams, params }) {
  const sc = searchParams.sc;
  console.log(params.username);
  let user = await getUser(params.username);

  if (!user) {
    notFound();
  }

  let message = "오류가 발생하였습니다.";
  if (sc === "200") {
    message = "전송이 성공적으로 완료되었습니다.";
  } else if (sc === "401") {
    message = "인증에 실패하여 전송되지 않았습니다.";
  } else {
    message = "알 수 없는 에러가 발생하였습니다.";
  }

  // 보낼 수 없는 기간이면 며칠 뒤 보내지는지
  if (!canPost(user.generation)) {
    const start = getMailStart(user.generation);
    let diff = diffDay(start);
  }

  function Footer() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          justifyContent: "flex-start",
        }}
      >
        <Link
          className={`submit ${styles.prev}`}
          href={`/mails/${user.username}`}
        >
          편지함
        </Link>
        <div style={{ width: 12 }}></div>
        <Link className={"submit"} href={`/mail/${user.username}`}>
          다시 작성하기
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="screen">
        <div style={{ flex: 130 }}></div>
        <span className={`material-symbols-outlined md-128`}>check_circle</span>
        <div style={{ height: 28 }}></div>
        <h2 className="font-bold text-2xl">
          편지가 <br /> 전송되었습니다!
        </h2>
        <div style={{ flex: 28 }}></div>
        <Good name={user.name}></Good>
        <div style={{ flex: 182 }}></div>
        <Footer />
        <div style={{ height: 36 }}></div>
      </div>
    </>
  );
}

// 여러 텍스트 컴포넌트 만들기
function Good(props) {
  return (
    <p className="font-medium text-xl">
      1일 이내에 {props.name} 훈련병에게
      <br />
      편지가 전달됩니다!
    </p>
  );
}
