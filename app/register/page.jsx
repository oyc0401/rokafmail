"use client";
import React, { useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import Information from "./information";
import Account from "./account";
import Introduction from "./introduction";

export default function Register() {
  let [page, setPage] = useState(1);

  const generation = useRef("");
  const name = useRef("");
  const birth = useRef("");
  const username = useRef("");
  const password = useRef("");
  const repassword = useRef("");
  const substring = useRef("");
  
  async function send() {
    axios
      .post("/api/register", {
        username: username.current,
        password: password.current,
        name: name.current,
        birth: birth.current,
        generation: generation.current,
        substring: substring.current,
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log("오류:", error);
        // setValidate(false);
      })
      .finally(function () {
        
      });
  }
  const router = useRouter();
  function push(){
  
     router.push(`/link/${username.current}`)
  }
  let pages = {
    1: (
      <Information
        click={() => setPage(2)}
        generation={generation}
        name={name}
        birth={birth}
      />
    ),
    2: (
      <Account
        click={() => setPage(3)}
        username={username}
        password={password}
        repassword={repassword}
      />
    ),
    3: (
      <Introduction
        click={() => push()}
        send={send}
        substring={substring}
      />
    ),
  };

  // pages[1]=pages[3];
  return <>{pages[page]}</>;
}
