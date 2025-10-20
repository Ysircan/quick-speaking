import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

/**
 * 从请求头中解析 JWT 并返回当前用户
 */
export default async function getCurrentUserFromRequest(req: Request) {
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) return null;

  try {
    // 解密 token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      uid: string;
    };

    // 查询数据库中的用户
    const user = await prisma.user.findUnique({
      where: { id: decoded.uid },
    });

    return user;
  } catch (err) {
    console.error("❌ 无法解析 token：", err);
    return null;
  }
}
