import {verifyUser} from './verifyUser'

export async function GET() {

  console.log("반복 실행: retry");
  await verifyUser();


  return new Response(200);
}
