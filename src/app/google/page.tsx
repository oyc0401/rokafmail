'use client'

import { signIn, useSession } from "next-auth/react";

export default function Privacy() {
   async function login() {
      const response = await signIn('google');
      //console.log(response);
   }

   const { data, status, update } = useSession();
  console.log(data);


   return <>
      <button onClick={login} >구글 로그인!</button>
   </>
}


