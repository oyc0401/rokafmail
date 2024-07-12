"use client";
import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import React, { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

interface Props {
  children: ReactNode;
}
const queryClient = new QueryClient()

export default function Providers({ children }: Props) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <NextUIProvider className="h-full">{children}</NextUIProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
