import jwt from "jsonwebtoken"
import { prisma } from "@/lib/prisma"

export default async function getCurrentUserFromRequest(req: Request) {
  const authHeader = req.headers.get("Authorization")
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null

  if (!token) return null

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    })

    return user
  } catch (err) {
    console.error("❌ 无法解析 token：", err)
    return null
  }
}
