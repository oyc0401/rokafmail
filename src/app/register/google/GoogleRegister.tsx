"use client";
import React, { useEffect } from "react";
import Information from "./information";
import Account from "./account";
import { useStore, useStoreBase } from "./model";

export default function GoogleRegister() {
  const { reset } = useStoreBase();
  useEffect(() => {
    // 새로고침 막기(조건 부여 가능)
    window.onbeforeunload = function() {
      return true;
    };
    return () => {
      reset();
      window.onbeforeunload = null;
    };
  }, [reset]);

  const page = useStore.use.page();

  const pages = {
    0: <Information />,
    1: <Account />,
  };

  return <>{pages[page]}</>;
}
