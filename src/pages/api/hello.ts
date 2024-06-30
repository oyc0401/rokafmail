import { authOptions } from "src/app/api/auth/[...nextauth]/authOptions"
import { getServerSession } from "next-auth/next"

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)

  console.log(res);
  if (!session) {
    res.status(401).json({})
    return
  }

  return res.json(session)
}