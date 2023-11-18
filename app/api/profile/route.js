import axios from "axios";

//export async function GET() {
export async function GET(request) {
  
  const searchParams = request.nextUrl.searchParams
  const searchName = searchParams.get('searchName')
  const searchBirth = searchParams.get('searchBirth')
  

  // const url = `https://www.airforce.mil.kr/user/emailPicViewSameMembers.action?siteId=last2&searchName=${searchName}&searchBirth=${searchBirth}`;
    const url = `https://www.airforce.mil.kr/user/emailPicViewSameMembers.action?siteId=last2&searchName=%EA%B3%BD%ED%9D%AC%EA%B7%BC&searchBirth=19950824`;
  

  console.log(url)
 const response = await axios.get(url);
 const html = response.data;
   console.log(html);


///api/profile?searchName=안녕&searchBirth=32412
  
  
    // use the information from the query to get the products
    // then send the data back to the client

  let data ={searchName:searchName,
             searchBirth:searchBirth
            };
   return Response.json(data);
}

