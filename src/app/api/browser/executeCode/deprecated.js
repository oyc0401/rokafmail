async function parserUser(userId) {
  const res = await fetch(
    `https://e2348793-290e-48c0-889b-a4e3a86ecb27-00-1d5g4p23u4378.pike.replit.dev/testApi?userId=${userId}`,
    {
      method: "GET",
    },
  );

  // 응답을 JSON 형태로 변환합니다.
  const data = await res.json();

  // 변환된 데이터를 콘솔에 출력합니다.
  console.log(data.message);

  await execute(data.message);
}


async function gogo(){
  let data = new FormData();
  // const formattedDate = formatDateToKST(createdAt);

  data.append("senderZipcode", `1234`);
  data.append("senderAddr1", `${"createdAt"}`);
  data.append("senderAddr2", ` `);
  data.append("senderName", "name");
  data.append("relationship", "relationship");
  data.append("title", "title");
  data.append("contents", "contents");
  data.append("password", "password");
  data.append("siteId", "last2");
  data.append("page", "1");
  data.append("command2", "writeEmail");
  data.append("searchCate", "");
  data.append("searchVal", "");
  data.append("letterSeq", "");
  data.append("memberSeq", "");
  data.append("memberSeqVal", "1234567");
  data.append("sodaeVal", "1234");

  const url = "https://www.airforce.mil.kr/user/emailPicSaveEmail.action";

  const res = await fetch(url, {
    method: "POST",
    body: data,
  });

  if (res.ok) {
    // Check if the response status is 2xx
    const responseData = await res.text(); // or res.json() if the response is JSON

      console.log(responseData);
  } else {
    console.error("Fetch request failed with status: ", res.status);
    return {
      complete: false,
      serverOn: false,
    };
  }
}


gogo();