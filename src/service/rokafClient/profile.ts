import axios from "axios";
import https from "https";
import { load } from "cheerio";
import { parse } from "node-html-parser";
import { makeLogger } from "config/winston";
import { RokafProfile } from "./RokafClientInterface";
const logger = makeLogger("Rokaf");

function exist(html) {
  const $ = load(html);

  const SameResultList = $(".SameResultList");

  if (SameResultList.length > 0) {
    // li 태그 안에 "교육생이 없습니다." 메시지가 포함되어 있는지 확인
    const liText = SameResultList.find("li").text();
    //console.log(liText)
    return !liText.includes("교육생이 없습니다.");
  } else {
    console.log(".SameResultList 클래스를 갖는 요소를 찾을 수 없습니다.");
    logger.error(
      `.SameResultList 클래스를 갖는 요소를 찾을 수 없습니다. ${html}`,
    );
    throw Error(".SameResultList 클래스를 갖는 요소를 찾을 수 없습니다.");
  }
}

function htmlToMemberSeq(html) {
  //console.log(html)
  // 여기에서는 가져온 HTML을 파싱하거나 원하는 작업을 수행합니다.
  const root = parse(html);
  // 예제: 클래스가 "choice"인 요소를 찾아서 onclick 속성 값 추출
  const buttonElement = root.querySelector(".choice");
  if (buttonElement == null) {
    throw Error("no .choice");
  } else {
    const onclickAttributeValue = buttonElement.getAttribute("onclick");
    if (onclickAttributeValue == null) {
      throw Error("no onclickAttributeValue");
    } else {
      const functionName = onclickAttributeValue
        .replace("resultSelect('", "")
        .replace("')", "");
      return functionName;
    }
  }
}

function htmlToSodae(html) {
  const doc = load(html);
  const sosok = doc(".first").find("dd").text();
  //console.log(sosok);

  const inputString = sosok;
  const numbers = inputString.match(/\b\d{1,3}\b/g);

  const numberList = numbers!.map(Number); // 문자열을 숫자로 변환
  const [대대, 중대, 소대, 호실, 번] = numberList;

  //console.log(`${대대}대대 ${중대}중대 ${소대}소대 ${호실}호실 ${번}번`);

  let strnum = `${번}`;
  if (번 < 10) strnum = `0${번}`;

  return `${중대}${소대}${strnum}`;
}


export async function getProfile(name: string, birth: string): Promise<RokafProfile> {
  const url = `https://www.airforce.mil.kr/user/emailPicViewSameMembers.action?siteId=last2&searchName=${name}&searchBirth=${birth}`;

  // console.log("-link:", url);
  logger.http(`crawling ${url}`);

  try {
    const response = await axios.get(url, {
      httpsAgent: new https.Agent({
        rejectUnauthorized: false, //허가되지 않은 인증을 reject하지 않겠다!
      }),
    });
    const html = response.data;
    // console.log(html)

    if (exist(html)) {
      const memberSeq = htmlToMemberSeq(html);
      const sodae = htmlToSodae(html);
      return {
        member: {
          memberSeq: memberSeq,
          sodae: sodae,
        },
        serverOn: true,
      };
    } else {
      //console.log("-cannot find user.");
      return {
        serverOn: true,
      };
    }
  } catch (error) {
    logger.warn(`error:, ${error.message}`);
    // console.log(`-error:`, error.message);
    return {
      serverOn: false,
    };
  }
}
