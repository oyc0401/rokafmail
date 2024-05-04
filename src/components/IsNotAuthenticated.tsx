'use client'
import { useSession } from "next-auth/react"

export function IsNotAuthenticated({ children }) {

  const { data: session, status } = useSession()

  if (status === "unauthenticated") {
    return children;
  }

  return <></>;
}