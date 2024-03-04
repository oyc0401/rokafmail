import axios from "axios";
import https from "https";
import FormData from "form-data";
import { parseKorea } from "src/lib/time";

import cheerio from "cheerio";
import { parse } from "node-html-parser";

import { makeLogger } from "config/winston";
const logger = makeLogger("Rokaf");

export async function postMail(
  { name, relationship, title, contents, password, memberSeq, sodae },
  createdAt: Date,
) {
  let data = new FormData();

  const dateJs = parseKorea(createdAt);
  const formattedDate = dateJs.format("YYYY.MM.DD HH:mm:ss");

  data.append("senderZipcode", `하늘인편`);
  data.append("senderAddr1", `${formattedDate}`);
  data.append("senderAddr2", ``);
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
// 7TXYFRbyWor7fK22YBh7L4EWI8BW3WH1xt9TQkOE6VT16srxnF8pkaUT2euc9a4P.AF1302_servlet_CONT21
  var config = {
    method: "post",
    url: "https://www.airforce.mil.kr/user/emailPicSaveEmail.action",
    headers: {
      Cookie:
        "JSESSIONID=pVmoG5hmwpHCRsLqdiV1hegWfRiH9418N4YZ3AW5cUo7pcXvxER8Lbk0XIljcEOa.AF1303_servlet_CONT31",
      ...data.getHeaders(),
    },
    timeout: 20000,
    data: data,
    httpsAgent: new https.Agent({
          rejectUnauthorized: false, //허가되지 않은 인증을 reject하지 않겠다!
        }),
  };

  // console.log(`[postMail] ${memberSeq} 편지 보내는 중...`);

  try {
    const res = await axios(config);
    //   console.log(`[postMail] ${memberSeq} 편지 보내기 성공!`);
    //console.log(res.data);

    const msgList = extractInnerText(res.data, "message");
    console.log(msgList,password);

    if(msgList[0] == '정상적으로 등록되었습니다.'){
      return {
        complete: true,
        serverOn: true,
      };
    }else{
      logger.warn(`${memberSeq} | ${msgList}`);
      return {
        complete: false,
        serverOn: true,
      };
    }
    
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

function extractInnerText(htmlString, className) {
  // HTML 문자열 파싱
  const root = parse(htmlString);

  // 특정 클래스를 가진 모든 요소를 찾음
  const elements = root.querySelectorAll(`.${className}`);

  // 요소들의 innerText를 배열로 수집
  const innerTexts = elements.map(element => element.innerText);

  // innerText 배열 리턴
  return innerTexts;
}
