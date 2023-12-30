import Link from "next/link";
import { getUser } from "../../server/getUser";
import styles from "./mails.module.css";
import { getUnconnectedPost } from "./server/getUnconnectedPost";
import{getPost} from'./server/getPost'
///res?sc=200&searchName=곽희근&searchBirth=19950824&memberSeqVal=347938631
export default async function Mails({ params }) {
  console.log(params.username);
  let user = await getUser(params.username);

  if (!user) {
    notFound();
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
          href={`https://www.airforce.mil.kr/user/indexSub.action?codyMenuSeq=156893223&siteId=last2&menuUIType=top&dum=dum&command2=getEmailList&searchName=${user.name}&searchBirth=${user.birth}&memberSeq=${user.memberSeq}`}
          target="_blank"
        >
          모든 편지
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
        <Unposted username={params.username}/>
        <Posted username={params.username}/>
        <div style={{ flex: 1 }}></div>
        <Footer />
        <div style={{ height: 36 }}></div>
      </div>
    </>
  );
}

async function Unposted(parms) {
  let unconnected = await getUnconnectedPost(parms.username);
  if (unconnected.length == 0) {
    return <></>;
  }

  function Inner() {
    return (
      <>
        {unconnected.map((post, index) => (
          <div key={post.id}>
            {index !== 0 && <div style={{ height: 4 }}></div>}
            <Card
              title={post.title}
              name={post.username}
              rel={post.relationship}
              time={dateStr(post.created_at)}
            />
          </div>
        ))}
      </>
    );
  }
  return (
    <div className={styles.box}>
      <div style={{ height: 24 }}></div>
      <h2 className="text-2xl">전송 대기중</h2>
      <div style={{ height: 24 }}></div>
      <Inner></Inner>
    </div>
  );
}

async function Posted(parms) {
  let posts = await getPost(parms.username);
  if (posts.length == 0) {
    return <>받은 편지가 없습니다.</>;
  }

  function Inner() {
    return (
      <>
        {posts.map((post, index) => (
          <div key={post.id}>
            {index !== 0 && <div style={{ height: 4 }}></div>}
            <Card
              title={post.title}
              name={post.username}
              rel={post.relationship}
              time={dateStr(post.created_at)}
            />
          </div>
        ))}
      </>
    );
  }
  return (
    <div className={styles.box}>
      <div style={{ height: 24 }}></div>
      <h2 className="text-2xl">받은 편지 목록</h2>
      <div style={{ height: 24 }}></div>
      <Inner></Inner>
    </div>
  );
}

function Card(params) {
  return (
    <div className={styles.card}>
      <p className="text-left text-lg">{params.title}</p>
      <div style={{ height: 4 }}></div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <p>{`${params.name} | ${params.rel}`}</p>
        <div style={{ flex: 1 }}></div>
        <p>{params.time}</p>
      </div>
    </div>
  );
}

function dateStr(date) {
  if (isToday(date)) {
    return toStringTime(date);
  } else {
    return toStringByFormatting(date, ".");
  }
}

function isToday(date) {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

function leftPad(value) {
  if (value >= 10) {
    return value;
  }

  return `0${value}`;
}

function toStringTime(source, delimiter = ":") {
  const hour = leftPad(source.getHours() + 1);
  const minute = leftPad(source.getMinutes() + 1);
  return [hour, minute].join(delimiter);
}

function toStringByFormatting(source, delimiter = "-") {
  const year = source.getFullYear();
  const month = leftPad(source.getMonth() + 1);
  const day = leftPad(source.getDate());

  return [year, month, day].join(delimiter);
}
