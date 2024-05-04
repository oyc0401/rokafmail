'use client'
import { useSession } from "next-auth/react"

export function IsLoading({ children }) {

  const { data: session, status } = useSession()

  if (status === "loading") {
    return children;
  }

  return undefined;
}