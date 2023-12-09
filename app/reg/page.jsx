"use client";
import React, { useRef, useState } from "react";

import Information from "./information";
import Account from "./account"
import Introduction from "./introduction"

export default function Register() {
  let [page, setPage] = useState(1);
  // let pages = {
  //   1: <Introduction click={() => setPage(4)} />,
  //   2: <Account click={() => setPage(3)} />,
  //   3:<Introduction click={() => setPage(4)} />,
  //   4:"dsad"
  // };
  
  let pages = {
    1: <Information click={() => setPage(2)} />,
    2: <Account click={() => setPage(3)} />,
    3:<Introduction click={() => setPage(4)} />,
    4:"dsad"
  };

  return <>{pages[page]}</>;
}
