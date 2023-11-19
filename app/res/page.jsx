import Link from "next/link";

///res?sc=200&searchName=곽희근&searchBirth=19950824&memberSeqVal=347938631
export default function ResultPage({ searchParams }) {
  const sc =  searchParams.sc;
  const memberSeqVal=searchParams.memberSeqVal;
  const generation=searchParams.generation;
  const searchBirth=searchParams.searchBirth;
  const searchName=searchParams.searchName;
  
  let message = "오류가 발생하였습니다.";
  if (sc === "200") {
    message = "전송이 성공적으로 완료되었습니다.";
  } else if (sc === "401") {
    message = "인증에 실패하여 전송되지 않았습니다.";
  } else {
    message = "알 수 없는 에러가 발생하였습니다.";
  }

    return (
      <>
        <h2>{message}</h2>
        <h1>필독</h1>
        <p>전송 후 아래의 '편지 목록' 버튼을 눌러 편지가 잘 전달되었는 지 확인하시기 바랍니다.</p>
        <p>공식 편지 목록에 작성한 편지가 없다면 오류가 발생한 것으로 재작성 하셔야 합니다.</p>
        <p>오류가 지속된다면 인편지기에게 문의하시기 바랍니다.</p>
        <p>편지목록은 공군의 공식 편지 전송 페이지로 작성 당시 설정한 비밀번호로 수정 및 삭제가 가능합니다.</p>
        <br />
        <a href={`https://www.airforce.mil.kr/user/indexSub.action?codyMenuSeq=156893223&siteId=last2&menuUIType=top&dum=dum&command2=getEmailList&searchName=${searchName}&searchBirth=${searchBirth}&memberSeq=${memberSeqVal}`}
          target="_blank" style={{"margin-right": "10px"}}>
          편지 목록
        </a>
        <Link href={`/mail?generation=${generation}&searchName=${searchName}&searchBirth=${searchBirth}`}>
          편지 작성
        </Link>
      </>
    )
}