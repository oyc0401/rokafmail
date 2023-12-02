const knex = require("knex")({
  // We are using PostgreSQL
  client: "postgres",
  // Use the `DATABASE_URL` environment variable we provide to connect to the Database
  // It is included in your Replit environment automatically (no need to set it up)
  connection: process.env.DATABASE_URL,

  // Optionally, you can use connection pools to increase query performance
  pool: { min: 0, max: 80 },
});

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

export async function POST(request) {
 // const formData = await request.formData()
   const body = await request.json();

  // 인터넷 편지 사이트 프로필 가져오기
  const searchName = body.name;
  const searchBirth = body.birth;

  const url = `https://www.airforce.mil.kr/user/emailPicViewSameMembers.action?siteId=last2&searchName=${searchName}&searchBirth=${searchBirth}`;

  console.log("훈련병 찾는중...",url)

  try {
  
    // const response = await axios.get(url);
    // const html = response.data;
    // //console.log(html);

    // let memberSeqVal = html2memberSeqVal(html);
    // let sodaeVal = html2sodaeVal(html);

    // let data = {
    //   memberSeqVal: memberSeqVal,
    //   sodaeVal: sodaeVal
    // };
    //  console.log(data)


    // 인증 된 유저 회원가입
   // const body = await request.json();
    console.log(body)
    console.log("DB 갑니다!")
      let user = {
        username: body.username,
        password: body.password,
        name: body.name,
        birth: body.birth,
        generation: body.generation,
     //   memberSeq:memberSeqVal,
       // sodae: sodaeVal,
       // connect: true,
      }
    console.log("얍!")



    // // 테이블 만들때 실행
    // await knex.schema.hasTable('users')
    // .then((exists) => {
    //   if(!exists){
        

    //   }
    // });
   
    await knex.schema.createTable('users', (table) => {
      table.increments('id').primary();
      table.string('username');
      table.string('password');
      table.string('name');
      table.string('birth');
      table.string('generation');
      table.string('memberSeq').nullable();
      table.string('sodae').nullable();
      table.boolean('connect').defaultTo(false);
    });

   

    // add user
    await knex("users").insert(user);



    
    console.log("성공!")
    return new Response('Hello, Next.js!', {
      status: 200
    })

  } catch (e) {

    console.log(e)
     //return Response.error("해당하는 훈련병이 없거나 편지쓰기 가능 시간이 아닙니다.");

    // 인증 안된 유저 회원가입
    // const body = await request.json();
    // let user = {
    //   userName: body.userName,
    //   password: body.password,
    //   name: body.name,
    //   birth: body.birth,
    //   generation: body.generation,
    // }

    // const createUser = await prisma.user.create({ data: user })

  } 

  









}
