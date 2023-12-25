"use client";
import React, { useRef, useState, useEffect } from "react";
import Information from "./information";
import Account from "./account";
import Introduction from "./introduction";
import { useStore } from "./model";

export default function Register() {
  useEffect(() => {
    // 새로고침 막기(조건 부여 가능)
    window.onbeforeunload = function () {
      return true;
    };
    return () => {
      window.onbeforeunload = null;
    };
  }, []);

  const page = useStore.use.page();

  let pages = {
    1: <Information />,
    2: <Account />,
    3: <Introduction />,
  };

  return <>{pages[page]}</>;
}
