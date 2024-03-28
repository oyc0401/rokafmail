import Link from "next/link";
import styles from "./mails.module.css";
import { Post, PostQueue, UnconnectedPost, User } from "src/db";
import { dateToStr } from "src/lib/time";
import { Nav } from "src/components";
import { notFound } from "next/navigation";
import { Card, DropDownCard } from "./card";
import { Header } from "src/components/Header";
///res?sc=200&searchName=곽희근&searchBirth=19950824&memberSeqVal=347938631
import { Tabss } from "./tab";
import { Content, UnConnectedContent } from "./Content";
export default async function Mails({ params }) {
  const username = decodeURI(params.username);

  let user = await User.findByUsername(username);

  if (!user) {
    notFound();
  }

  let posts = await Post.findPostedByUsername(username);
  let queue = await PostQueue.findByUsername(username);
  let unconnected = await UnconnectedPost.findByUsername(username);


  return (
    <>
      <Header></Header>
      {user.connect ? <Content mails={posts} unpostMails={queue}></Content>
        : <UnConnectedContent mails={unconnected} ></UnConnectedContent>}


      <div style={{ height: 108, minHeight: 108, width: 1 }}></div>
      <nav className="fixed bottom-0 w-full">
        <footer className="container max-w-5xl mx-auto px-8">
          <div className="row pt-3 pb-9">
            <Link className={"submit"} href={`/mail/${user.username}`}>
              편지 작성
            </Link>
          </div></footer>
      </nav>

    </>
  );
}

// {/* {user.connect ? (

// ) : (
//   <Nav>
//     <Link className={"submit"} href={`/mail/${user.username}`}>
//       편지 작성
//     </Link>
//   </Nav>
// )} */}



