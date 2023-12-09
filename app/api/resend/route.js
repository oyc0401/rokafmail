import {reconnect} from './reconnect'

export async function POST() {

  console.log("반복 실행: resend");
  await reconnect();


  return new Response(200);
}
