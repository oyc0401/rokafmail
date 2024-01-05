import {verifyUser} from './verifyUser'
import{repostMail} from'./repostMail'

export async function GET() {

  console.log("반복 실행: retry");
  
   verifyUser();
 repostMail();

  return new Response(200);
}
