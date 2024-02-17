"use client";
import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}
export default function Providers({ children }: Props) {
  return (
    <SessionProvider>
      <NextUIProvider style={{height:'100%'}}>{children}</NextUIProvider>
    </SessionProvider>
  );
}
