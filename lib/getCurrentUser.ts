// File: lib/getCurrentUserFromRequest.ts
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

type DecodedToken = {
  uid: string;              // 用户ID
  admin?: boolean;          // 是否后台账号
  ver?: boolean;            // 邮箱是否验证
  pwdv?: number | null;     // 密码版本戳
};

export default async function getCurrentUserFromRequest(req: Request) {
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    // 从数据库查找对应用户
    const user = await prisma.user.findUnique({
      where: { id: decoded.uid },
    });

    if (!user) return null;

    return user;
  } catch (err) {
    console.error("❌ Invalid or expired token:", err);
    return null;
  }
}
