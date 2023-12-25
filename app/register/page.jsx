"use client";
import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import Information from "./information";
import Account from "./account";
import Introduction from "./introduction";

export default function Register() {
  let [page, setPage] = useState(1);

  useEffect(() => {
    // 새로고침 막기(조건 부여 가능)
    window.onbeforeunload = function () {
      return true;
    };
    return () => {
      window.onbeforeunload = null;
    };
  }, []);

  const generation = useRef("");
  const name = useRef("");
  const birth = useRef("");
  const username = useRef("");
  const password = useRef("");
  const repassword = useRef("");
  const substring = useRef("");

  async function send() {
    try {
      await axios.post("/api/register", {
        username: username.current,
        password: password.current,
        name: name.current,
        birth: birth.current,
        generation: generation.current,
        substring: substring.current,
      });
      router.push(`/link/${username.current}`);
    } catch (error) {
      console.log("오류:", error);
      alert("오류:", error);
    }
  }
  const router = useRouter();

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
    3: <Introduction click={send} substring={substring} />,
  };

  // pages[1]=pages[3];
  return <>{pages[page]}</>;
}
