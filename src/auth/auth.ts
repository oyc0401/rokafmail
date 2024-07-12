import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next"
import { Session, getServerSession } from "next-auth"
import { authOptions } from "./authOptions"

// Use it in server contexts
export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
): Promise<Session | null> {
  return getServerSession(...args, authOptions)
}