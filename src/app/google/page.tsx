'use client'

import { signIn } from "next-auth/react";

export default function Privacy() {
 return <>
   <button onClick={() => signIn('google')} >구글 로그인!</button>
 </>
}


