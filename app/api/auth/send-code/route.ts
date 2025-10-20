import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const Body = z.object({
  email: z.string().email(),
  purpose: z.enum(["SIGNUP"]).default("SIGNUP"),
});

export async function POST(req: Request) {
  const body = await req.json();
  const { email: rawEmail, purpose } = Body.parse(body);
  const email = rawEmail.trim().toLowerCase();

  // 60 秒频控
  const recent = await prisma.emailVerification.findFirst({
    where: { email, purpose, createdAt: { gte: new Date(Date.now() - 60_000) } },
    orderBy: { createdAt: "desc" },
  });
  if (recent) {
    return NextResponse.json({ ok: false, message: "60 秒后再试" }, { status: 429 });
  }

  // 生成 6 位验证码
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 分钟

  await prisma.emailVerification.create({
    data: { email, code, purpose, expiresAt },
  });

  // 先打印到日志，后面再接入发送邮件服务
  console.log(`[VERIFY CODE] ${email} -> ${code}`);

  return NextResponse.json({ ok: true });
}
