import Link from "next/link";
import { getUser } from "../../server/getUser";
import styles from "./mails.module.css";
import { getUnconnectedPost } from "./server/getUnconnectedPost";
import { getPost } from "./server/getPost";
import { dateToStr } from "./dateToStr";
///res?sc=200&searchName=곽희근&searchBirth=19950824&memberSeqVal=347938631
export default async function Mails({ params }) {
  console.log(params.username);
  let user = await getUser(params.username);

  if (!user) {
    notFound();
  }

  function Footer() {
    return (
      <div className={styles.footer}>
        <div
          style={{
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 12,
            paddingBottom: 36,
          }}
        >
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
              작성하기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="screen">
        <Post username={params.username} />
        <div style={{ flex: 1, minHeight: 32 }}></div>

        <Footer />
        <div style={{ height: 36 }}></div>
      </div>
    </>
  );
}
async function Post(parms) {
  let posts = await getPost(parms.username);
  let unconnected = await getUnconnectedPost(parms.username);

  if (posts.length == 0 && unconnected.length == 0) {
    return <>받은 편지가 없습니다.</>;
  }

  function Unposted() {
    return (
      <div className={styles.box}>
        <div style={{ height: 24 }}></div>
        <h2 className="text-2xl font-medium">전송 대기중</h2>
        <div style={{ height: 24 }}></div>
        {posts.map((post, index) => (
          <div key={post.id}>
            {index !== 0 && <div style={{ height: 4 }}></div>}
            <Card
              title={post.title}
              name={post.username}
              rel={post.relationship}
              time={dateToStr(post.created_at)}
            />
          </div>
        ))}
      </div>
    );
  }

  function Posted() {
    return (
      <div className={styles.box}>
        <div style={{ height: 24 }}></div>

        <h2 className="text-2xl font-medium">받은 편지 목록</h2>

        <div style={{ height: 24 }}></div>
        {posts.map((post, index) => (
          <div key={post.id}>
            {index !== 0 && <div style={{ height: 4 }}></div>}
            <Card
              title={post.title}
              name={post.username}
              rel={post.relationship}
              time={dateToStr(post.created_at)}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {unconnected.length != 0 ? <Unposted /> : <></>}
      {posts.length != 0 ? <Posted /> : <></>}
    </>
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
