import axios from "axios";
import cheerio from "cheerio";
import { parse } from "node-html-parser";

function htmlToMemberSeq(html) {
  // 여기에서는 가져온 HTML을 파싱하거나 원하는 작업을 수행합니다.
  const root = parse(html);
  // 예제: 클래스가 "choice"인 요소를 찾아서 onclick 속성 값 추출
  let buttonElement = root.querySelector(".choice");
  if (buttonElement == null) {
    throw Error("해당 교육생을 찾을 수 없습니다.");
  } else {
    let onclickAttributeValue = buttonElement.getAttribute("onclick");
    if (onclickAttributeValue == null) {
      throw Error("해당 유저가 없습니다.");
    } else {
      let functionName = onclickAttributeValue
        .replace("resultSelect('", "")
        .replace("')", "");
      return functionName;
    }
  }
}

function htmlToSodae(html) {
  const doc = cheerio.load(html);
  let sosok = doc(".first").find("dd").text();
  //console.log(sosok);

  let inputString = sosok;
  let numbers = inputString.match(/\b\d{1,3}\b/g);

  let numberList = numbers!.map(Number); // 문자열을 숫자로 변환
  let [대대, 중대, 소대, 호실, 번] = numberList;

  //console.log(`${대대}대대 ${중대}중대 ${소대}소대 ${호실}호실 ${번}번`);

  let strnum = `${번}`;
  if (번 < 10) strnum = `0${번}`;

  return `${중대}${소대}${strnum}`;
}

export async function getProfile(name: string, birth: string) {
  const url = `https://www.airforce.mil.kr/user/emailPicViewSameMembers.action?siteId=last2&searchName=${name}&searchBirth=${birth}`;

  console.log("훈련병 찾는중...", url);

  try {
    const response = await axios.get(url);
    const html = response.data;
    let memberSeq = htmlToMemberSeq(html);
    let sodae = htmlToSodae(html);
    return {
      connect: true,
      memberSeq: memberSeq,
      sodae: sodae,
      serverOn: true,
    };
  } catch (error) {
    let serverOn = true;
    if (error.message == "해당 유저가 없습니다.") {
      console.log("cannot find user.");
      serverOn = true;
    } else {
      console.log(`유저 인증 오류:`, error.message);
      serverOn = false;
    }

    return {
      connect: false,
      memberSeq: null,
      sodae: null,
      serverOn: serverOn,
    };
  }
}
