const puppeteer = require("puppeteer");

import { NextResponse } from "next/server";
import { parseKorea } from "src/lib/time";
import { makeLogger } from "config/winston";
const logger = makeLogger("puppeteer");

export async function POST() {
  console.log(0);
  runCodeInBrowser();
  return NextResponse.json(
    { message: new Date() },
    {
      status: 200,
    },
  );
}

async function runCodeInBrowser() {
  console.log(1);
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  console.log(2);
  const page = await browser.newPage();
  console.log(3);
  page.on("console", (msg) => {
       console.log("PAGE LOG:", msg.text());
  });
  console.log(4);
  await page.goto(
    "https://www.airforce.mil.kr/user/indexSub.action?codyMenuSeq=156893223&siteId=last2&menuUIType=sub",
  );
  console.log(5);

  // 여기에 실행할 코드를 입력합니다.
  await page.evaluate(() => {
    console.log("!@#!@#");
    ////////////////////////////////////////////////////////////////
    // async function execute(list) {
    //   for (let post of list) {
    //     const {
    //       postId,
    //       name,
    //       relationship,
    //       title,
    //       contents,
    //       password,
    //       memberSeq,
    //       sodae,
    //       createdAt,
    //     } = post;
    //     const data = await postMail(
    //       { name, relationship, title, contents, password, memberSeq, sodae },
    //       createdAt,
    //     );

    //     if (data.complete) {
    //       console.log("성공!", `${postId} - pw: ${password}`);
    //       await fetch(
    //         "https://e2348793-290e-48c0-889b-a4e3a86ecb27-00-1d5g4p23u4378.pike.replit.dev/api/browser/popPostQueue",
    //         {
    //           method: "POST",
    //           body: JSON.stringify({ postId }),
    //         },
    //       );
    //     } else {
    //       return console.log("실패");
    //     }
    //   }
    // }

    function extractInnerText(htmlString, className) {
      // DOMParser 인스턴스를 생성합니다.
      const parser = new DOMParser();

      // HTML 문자열을 파싱하여 DOM Document를 생성합니다.
      const doc = parser.parseFromString(htmlString, "text/html");

      // 특정 클래스를 가진 모든 요소를 찾습니다.
      const elements = doc.querySelectorAll(`.${className}`);

      // 요소들의 innerText를 배열로 수집합니다.
      const innerTexts = Array.from(elements).map(
        (element) => element.textContent,
      );

      // innerText 배열을 반환합니다.
      return innerTexts;
    }

    // async function postMail(
    //   { name, relationship, title, contents, password, memberSeq, sodae },
    //   createdAt,
    // ) {
    //   let data = new FormData();
    //   // const formattedDate = formatDateToKST(createdAt);

    //   data.append("senderZipcode", `하늘인편`);
    //   data.append("senderAddr1", `${createdAt}`);
    //   data.append("senderAddr2", ` `);
    //   data.append("senderName", name);
    //   data.append("relationship", relationship);
    //   data.append("title", title);
    //   data.append("contents", contents);
    //   data.append("password", password);
    //   data.append("siteId", "last2");
    //   data.append("page", "1");
    //   data.append("command2", "writeEmail");
    //   data.append("searchCate", "");
    //   data.append("searchVal", "");
    //   data.append("letterSeq", "");
    //   data.append("memberSeq", "");
    //   data.append("memberSeqVal", memberSeq);
    //   data.append("sodaeVal", sodae);

    //   const url = "https://www.airforce.mil.kr/user/emailPicSaveEmail.action";

    //   try {
    //     const res = await fetch(url, {
    //       method: "POST",
    //       body: data,
    //     });

    //     if (res.ok) {
    //       // Check if the response status is 2xx
    //       const responseData = await res.text(); // or res.json() if the response is JSON
    //       const msgList = extractInnerText(responseData, "message");
    //       console.log(msgList, password);

    //       if (msgList[0] == "정상적으로 등록되었습니다.") {
    //         return {
    //           complete: true,
    //           serverOn: true,
    //         };
    //       } else {
    //         console.warn(`${memberSeq} | ${msgList}`);
    //         return {
    //           complete: false,
    //           serverOn: true,
    //         };
    //       }
    //     } else {
    //       console.error("Fetch request failed with status: ", res.status);
    //       return {
    //         complete: false,
    //         serverOn: false,
    //       };
    //     }
    //   } catch (error) {
    //     console.error("Fetch request resulted in an error: ", error);
    //     return {
    //       complete: false,
    //       serverOn: false,
    //     };
    //   }
    // }


    async function gogo(){
      let data = new FormData();
      // const formattedDate = formatDateToKST(createdAt);

      data.append("senderZipcode", `하늘인편`);
      data.append("senderAddr1", `${'createdAt'}`);
      data.append("senderAddr2", ` `);
      data.append("senderName", 'name');
      data.append("relationship", 'relationship');
      data.append("title", 'title');
      data.append("contents", 'contents');
      data.append("password", 'password');
      data.append("siteId", "last2");
      data.append("page", "1");
      data.append("command2", "writeEmail");
      data.append("searchCate", "");
      data.append("searchVal", "");
      data.append("letterSeq", "");
      data.append("memberSeq", "");
      data.append("memberSeqVal", 'memberSeq');
      data.append("sodaeVal", 'sodae');

      const url = "https://www.airforce.mil.kr/user/emailPicSaveEmail.action";

      try {
        const res = await fetch(url, {
          method: "POST",
          body: data,
        });

        if (res.ok) {
          // Check if the response status is 2xx
          const responseData = await res.text(); // or res.json() if the response is JSON
          const msgList = extractInnerText(responseData, "message");
         // console.log(msgList, password);

          if (msgList[0] == "정상적으로 등록되었습니다.") {
            return {
              complete: true,
              serverOn: true,
            };
          } else {
            console.warn(`${'memberSeq'} | ${msgList}`);
            return {
              complete: false,
              serverOn: true,
            };
          }
        } else {
          console.error("Fetch request failed with status: ", res.status);
          return {
            complete: false,
            serverOn: false,
          };
        }
      } catch (error) {
        console.error("Fetch request resulted in an error: ", error);
        return {
          complete: false,
          serverOn: false,
        };
      }
    }

    gogo();

    // async function parser() {
    //   const res = await fetch(
    //     `https://e2348793-290e-48c0-889b-a4e3a86ecb27-00-1d5g4p23u4378.pike.replit.dev/api/browser/getPostQueue`,
    //     {
    //       method: "GET",
    //     },
    //   );

    //   // 응답을 JSON 형태로 변환합니다.
    //   const data = await res.json();

    //   // 변환된 데이터를 콘솔에 출력합니다.
    //   console.log(data.message);

    //   await execute(data.message);
    // }

    // // 실행
    // parser();

    ////////////////////////////////////////////////////////
  });
  console.log(6);
  await browser.close();
  console.log(7);
}
