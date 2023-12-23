import axios from "axios";
import cheerio from 'cheerio';
import { parse } from 'node-html-parser';


function html2memberSeqVal(html) {
  // 여기에서는 가져온 HTML을 파싱하거나 원하는 작업을 수행합니다.
  const root = parse(html);
  // 예제: 클래스가 "choice"인 요소를 찾아서 onclick 속성 값 추출
  var buttonElement = root.querySelector('.choice');
  var onclickAttributeValue = buttonElement.getAttribute('onclick');
  var functionName = onclickAttributeValue.replace("resultSelect('", "").replace("')", "");

  return functionName;
}

function html2sodaeVal(html) {
  const doc = cheerio.load(html);
  let sosok = doc('.first').find("dd").text();
  //console.log(sosok);

  var inputString = sosok;
  var numbers = inputString.match(/\b\d{1,3}\b/g);

  numbers = numbers.map(Number); // 문자열을 숫자로 변환
  var [대대, 중대, 소대, 호실, 번] = numbers;

  //console.log(`${대대}대대 ${중대}중대 ${소대}소대 ${호실}호실 ${번}번`);


  if (번 < 10) {
    번 = `0${번}`;
  }

  return `${중대}${소대}${번}`;

}


export async function getProfile(name, birth) {
  const url = `https://www.airforce.mil.kr/user/emailPicViewSameMembers.action?siteId=last2&searchName=${name}&searchBirth=${birth}`;

  console.log("훈련병 찾는중...", url)

  try {
    const response = await axios.get(url);
    const html = response.data;

    let memberSeqVal = html2memberSeqVal(html);
    let sodaeVal = html2sodaeVal(html);

    let data = {
      connect: true,
      memberSeq: memberSeqVal,
      sodae: sodaeVal
    };

    return data;
  } catch (e) {

    // console.log(e)
    console.log("해당하는 훈련병이 없거나 편지쓰기 가능 시간이 아닙니다.");

    return {
      connect: false,
      memberSeq: null,
      sodae: null
    }
  }

}