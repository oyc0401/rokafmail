"use client";
import React, { useRef, useState } from "react";

import Information from "./information";
import Account from "./account"

export default function Register() {
  let [page, setPage] = useState(1);
  let pages = {
    2: <Information click={() => setPage(2)} />,
    1: <Account click={() => setPage(3)} />,
    3:"33333"
  };
  
  // let pages = {
  //   1: <Information click={() => setPage(2)} />,
  //   2: <Account click={() => setPage(3)} />,
  //   3:"33333"
  // };

  return <>{pages[page]}</>;
}
