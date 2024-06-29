'use client'
import { useSession } from "next-auth/react"

export function IsAuthenticated({ children }) {

  const { data: session, status } = useSession();
  console.log('IsAuthenticated:',session);
  if (status === "authenticated") {
    return children;
  }
  return undefined;
}

export function IsLoading({ children }) {

  const { data: session, status } = useSession()

  if (status === "loading") {
    return children;
  }

  return undefined;
}

export function IsNotAuthenticated({ children }) {

  const { data: session, status } = useSession()

  if (status === "unauthenticated") {
    return children;
  }

  return undefined;
}