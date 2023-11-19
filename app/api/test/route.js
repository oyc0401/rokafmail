import axios from "axios";
import FormData from "form-data";

export async function POST(request) {
  const body = await request.json();
  console.log(body);

 
  return new Response(200);
}