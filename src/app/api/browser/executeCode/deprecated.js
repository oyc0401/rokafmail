async function parserUser(userId){
  const res = await fetch(`https://e2348793-290e-48c0-889b-a4e3a86ecb27-00-1d5g4p23u4378.pike.replit.dev/testApi?userId=${userId}`, {
    method: "GET"
  });

  // 응답을 JSON 형태로 변환합니다.
  const data = await res.json();

  // 변환된 데이터를 콘솔에 출력합니다.
  console.log(data.message);

  await execute(data.message);
}
