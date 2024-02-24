import axios from "axios";
import FormData from "form-data";
import { parseKorea } from "src/lib/time";

import { makeLogger } from "config/winston";
const logger = makeLogger("Rokaf");

export async function postMail(
  { name, relationship, title, contents, password, memberSeq, sodae },
  createdAt: Date,
) {
  let data = new FormData();


  const dateJs=parseKorea(createdAt);
  const formattedDate = dateJs.format("YYYY.MM.DD HH:mm:ss")

  data.append("senderZipcode", `00000`);
  data.append("senderAddr1", "하늘인편");
  data.append("senderAddr2", `${formattedDate}`);
  data.append("senderName", name);
  data.append("relationship", relationship);
  data.append("title", title);
  data.append("contents", contents);
  data.append("password", password);
  data.append("siteId", "last2");
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
    timeout: 10000,
    data: data,
  };

 // console.log(`[postMail] ${memberSeq} 편지 보내는 중...`);

  try {
    const res = await axios(config);
   //   console.log(`[postMail] ${memberSeq} 편지 보내기 성공!`);
    //console.log(res.data)
    return {
      complete: true,
      serverOn: true,
    };
  } catch (error) {
    if (error.response) {
      console.log(
        `debug - ${memberSeq} 편지 오류: ${error.message} status:${error.response.status}`,
      );
      logger.debug(
        `${memberSeq} 편지 오류: ${error.message} status:${error.response.status}`,
      );
    } else {
      console.log(`warning - ${memberSeq} 편지 오류: ${error.message}`);
      logger.warn(`${memberSeq} 편지 오류: ${error.message}`);
    }
    return {
      complete: false,
      serverOn: false,
    };
  }
}
