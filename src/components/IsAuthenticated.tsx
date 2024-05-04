'use client'
import { useSession } from "next-auth/react"

export function IsAuthenticated({ children }) {
  
  const { data: session, status } = useSession();
  
  if (status === "authenticated") {
    return children;
  }
  return <></>;

}