import Link from "next/link";
import { getUser } from "../../server/getUser";
import styles from "./mails.module.css";

///res?sc=200&searchName=곽희근&searchBirth=19950824&memberSeqVal=347938631
export default async function Mails({params}) {
 
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
          모든 편지 보기!
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
        <h2>메일들!</h2>
        
        <br />
        <div style={{ flex: 1 }}></div>
        <Footer />
        <div style={{ height: 36 }}></div>
      </div>
    </>
  );
}
