import Link from "next/link";
import { getUser } from "../../server/getUser";
import styles from "./mails.module.css";
import { getUnconnectedPost } from "./server/getUnconnectedPost";
import { getPost } from "./server/getPost";
import { getPostQueue } from "./server/getPostQueue";
import { dateToStr } from "./dateToStr";
import { Nav } from "../../components/Nav";
///res?sc=200&searchName=곽희근&searchBirth=19950824&memberSeqVal=347938631

export default async function Mails({ params }) {
  console.log(params.username);
  let user = await getUser(params.username);

  if (!user) {
    notFound();
  }

  return (
    <>
      <div className="scrollable">
        {user.connect ? (
          <Post username={params.username} />
        ) : (
          <UnconnectedPost username={params.username} />
        )}
        {user.connect ? (
          <Nav>
            <Link
              className={`submit mini`}
              href={`https://www.airforce.mil.kr/user/indexSub.action?codyMenuSeq=156893223&siteId=last2&menuUIType=top&dum=dum&command2=getEmailList&searchName=${user.name}&searchBirth=${user.birth}&memberSeq=${user.memberSeq}`}
              target="_blank"
            >
              기훈단
            </Link>
            <div style={{ width: 12 }}></div>
            <Link className={"submit"} href={`/mail/${user.username}`}>
              편지 작성
            </Link>
          </Nav>
        ) : (
          <Nav>
            <Link className={"submit"} href={`/mail/${user.username}`}>
              편지 작성
            </Link>
          </Nav>
        )}
      </div>
    </>
  );
}
async function Post(parms) {
  let posts = await getPost(parms.username);
  let queue = await getPostQueue(parms.username);

  console.log(posts);
  console.log(queue);
  if (posts.length == 0 && queue.length == 0) {
    return <NoPost />;
  }

  function Unposted() {
    return (
      <div className={styles.box}>
        <div style={{ height: 24 }}></div>
        <h2 className="text-2xl font-medium">전송 대기중</h2>
        <div style={{ height: 24 }}></div>
        {queue.map((post, index) => (
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
      {queue.length != 0 ? <Unposted /> : <></>}
      {posts.length != 0 ? <Posted /> : <></>}
    </>
  );
}

async function UnconnectedPost(parms) {
  let unconnected = await getUnconnectedPost(parms.username);

  console.log(unconnected);
  if (unconnected.length == 0) {
    return <NoPost />;
  }

  return (
    <div className={styles.box}>
      <div style={{ height: 24 }}></div>
      <h2 className="text-2xl font-medium">전송 대기중</h2>
      <div style={{ height: 24 }}></div>
      {unconnected.map((post, index) => (
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

function NoPost() {
  return (
    <>
      <div style={{ height: 24 }}></div>
      <h1 className="text-2xl font-medium">받은 편지가 없습니다.</h1>
    </>
  );
}
