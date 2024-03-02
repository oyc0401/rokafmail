import Link from "next/link";
import styles from "./mails.module.css";
import { Post, PostQueue, UnconnectedPost, User } from "src/db";
import { dateToStr } from "src/lib/time";
import { Nav } from "src/components";
import { notFound } from "next/navigation";
import { Card, DropDownCard } from "./card";
///res?sc=200&searchName=곽희근&searchBirth=19950824&memberSeqVal=347938631

export default async function Mails({ params }) {
  const username = decodeURI(params.username);

  let user = await User.findByUsername(username);

  if (!user) {
    notFound();
  }

  return (
    <div className="screen">
      {user.connect ? (
        <Mail username={username} />
      ) : (
        <UnconnectedMail username={username} />
      )}
      {user.connect ? (
        <Nav elevation={true}>
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
  );
}
async function Mail({ username }) {
  let posts = await Post.findPostedByUsername(username);
  let queue = await PostQueue.findByUsername(username);

  //console.log(posts);
  //console.log(queue);
  if (posts.length == 0 && queue.length == 0) {
    return <NoPost />;
  }

  function Unposted() {
    return (
      <div className={styles.box}>
        <div className="sized" style={{ height: 24 }}></div>
        <h2 className="text-2xl font-medium">전송 대기중</h2>
        <div className="sized" style={{ height: 24 }}></div>
        {queue.map((post, index) => (
          <div key={post.id}>
            {index !== 0 && <div className="sized" style={{ height: 4 }}></div>}
            <DropDownCard
              id={post.postId}
              title={post.post.title}
              name={post.post.name}
              rel={post.post.relationship}
              time={dateToStr(post.post.createdAt)}
              username={post.user.username}
            />
          </div>
        ))}
      </div>
    );
  }

  function Posted() {
    return (
      <div className={styles.box}>
        <div className="sized" style={{ height: 24 }}></div>

        <h2 className="text-2xl font-medium">받은 편지 목록</h2>

        <div className="sized" style={{ height: 24 }}></div>
        {posts.map((post, index) => (
          <div key={post.id}>
            {index !== 0 && <div className="sized" style={{ height: 4 }}></div>}
            <DropDownCard
              id={post.id}
              title={post.title}
              name={post.name}
              rel={post.relationship}
              time={dateToStr(post.createdAt)}
              username={post.user.username}
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

async function UnconnectedMail(parms) {
  let unconnected = await UnconnectedPost.findByUsername(parms.username);

  //console.log(unconnected);
  if (unconnected.length == 0) {
    return <NoPost />;
  }

  return (
    <div className={styles.box}>
      <div className="sized" style={{ height: 24 }}></div>
      <h2 className="text-2xl font-medium">전송 대기중</h2>
      <div className="sized" style={{ height: 24 }}></div>
      {unconnected.map((post, index) => (
        <div key={post.id}>
          {index !== 0 && <div className="sized" style={{ height: 4 }}></div>}
          <DropDownCard
            id={post.postId}
            title={post.post.title}
            name={post.post.name}
            rel={post.post.relationship}
            time={dateToStr(post.post.createdAt)}
            username={post.user.username}
          />
        </div>
      ))}
    </div>
  );
}

function NoPost() {
  return (
    <>
      <div className="sized" style={{ height: 24 }}></div>
      <h1 className="text-2xl font-medium">받은 편지가 없습니다.</h1>
    </>
  );
}
