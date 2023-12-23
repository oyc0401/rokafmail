import axios from "axios";
import FormData from "form-data";

export async function postMail(body) {
  var data = new FormData();

  data.append("senderZipcode", "06252");
  data.append("senderAddr1", "서울특별시 강남구 강남대로 328");
  data.append("senderAddr2", "역삼동");
  data.append("senderName", body.name);
  data.append("relationship", body.relationship);
  data.append("title", body.title);
  data.append("contents", body.contents);
  data.append("password", body.password);
  data.append("siteId", "last2");
  data.append(
    "parent",
    "%2Fuser%2FindexSub.action%3FcodyMenuSeq%3D156893223%26siteId%3Dlast2%26menuUIType%3Dtop%26dum%3Ddum%26command2%3DwriteEmail%26searchCate%3D%26searchVal%3D%26page%3D1%26memberSeqVal%3D338287671%26sodaeVal%3D2344",
  );
  data.append("page", "1");
  data.append("command2", "writeEmail");
  data.append("searchCate", "");
  data.append("searchVal", "");
  data.append("letterSeq", "");
  data.append("memberSeq", "");
  data.append("memberSeqVal", body.memberSeq);
  data.append("sodaeVal", body.sodae);

  var config = {
    method: "post",
    url: "https://atc.airforce.mil.kr:444/user/emailPicSaveEmail.action",
    headers: {
      Cookie:
        "JSESSIONID=pVmoG5hmwpHCRsLqdiV1hegWfRiH9418N4YZ3AW5cUo7pcXvxER8Lbk0XIljcEOa.AF1303_servlet_CONT31",
      ...data.getHeaders(),
    },
    timeout: 10000,
    data: data,
  };

  console.log(`[postMail] ${body.memberSeq} 편지 보내는 중...`);
  
  try {
    await axios(config);
    console.log(`[postMail] ${body.memberSeq} 편지 보내기 성공!`);
    return true;
  } catch (error) {
    console.log(`${body.memberSeq} 편지 오류`);
    console.log(`${body.memberSeq} 편지 오류:`, error);
    return false;
  }
}
