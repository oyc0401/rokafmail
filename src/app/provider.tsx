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
      <NextUIProvider className="h-full">{children}</NextUIProvider>
    </SessionProvider>
  );
}
