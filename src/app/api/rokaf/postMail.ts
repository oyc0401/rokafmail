import axios from "axios";
import FormData from "form-data";

export async function postMail({
  name,
  relationship,
  title,
  contents,
  password,
  memberSeq,
  sodae,
}):  {
  let data = new FormData();

  data.append("senderZipcode", "06252");
  data.append("senderAddr1", "서울특별시 강남구 강남대로 328");
  data.append("senderAddr2", "역삼동");
  data.append("senderName", name);
  data.append("relationship", relationship);
  data.append("title", title);
  data.append("contents", contents);
  data.append("password", password);
  data.append("siteId", "last2");
  //   data.append(
  //     "parent",
  // "%2Fuser%2FindexSub.action%3FcodyMenuSeq%3D156893223%26siteId%3Dlast2%26menuUIType%3Dtop%26dum%3Ddum%26command2%3DwriteEmail%26searchCate%3D%26searchVal%3D%26page%3D1%26memberSeqVal%3D338287671%26sodaeVal%3D2344",
  //   );
  data.append("page", "1");
  data.append("command2", "writeEmail");
  data.append("searchCate", "");
  data.append("searchVal", "");
  data.append("letterSeq", "");
  data.append("memberSeq", "");
  data.append("memberSeqVal", memberSeq);
  data.append("sodaeVal", sodae);

  var config = {
    method: "post",
    url: "https://atc.airforce.mil.kr:444/user/emailPicSaveEmail.action",
    headers: {
      Cookie:
        "JSESSIONID=pVmoG5hmwpHCRsLqdiV1hegWfRiH9418N4YZ3AW5cUo7pcXvxER8Lbk0XIljcEOa.AF1303_servlet_CONT31",
      ...data.getHeaders(),
    },
    timeout: 30000,
    data: data,
  };

  console.log(`[postMail] ${memberSeq} 편지 보내는 중...`);

  try {
    await axios(config);
    console.log(`[postMail] ${memberSeq} 편지 보내기 성공!`);
    return {
      complete: true,
      serverOn: true,
    };
  } catch (error) {
    if (error.response) {
      console.log(
        `${body.memberSeq} 편지 오류:`,
        error.message,
        error.response.status,
      );
    } else {
      console.log(`${memberSeq} 편지 오류:`, error.message);
    }
    return {
      complete: false,
      serverOn: false,
    };
  }
}
