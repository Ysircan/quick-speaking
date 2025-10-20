import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, normEmail, signJwt } from "@/lib/auth";

// POST /api/auth/register
// body: { name, email, password, code }
export async function POST(req: NextRequest) {
  try {
    const { name, email: rawEmail, password, code } = await req.json();

    // 基本校验
    if (!name || !rawEmail || !password || !code) {
      return NextResponse.json({ ok: false, message: "Missing required fields." }, { status: 400 });
    }

    const email = normEmail(rawEmail);

    // 验证码校验（SIGNUP、未过期、未使用、最新一条）
    const v = await prisma.emailVerification.findFirst({
      where: { email, purpose: "SIGNUP", usedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: "desc" },
    });
    if (!v || v.code !== code) {
      return NextResponse.json({ ok: false, message: "Invalid or expired code." }, { status: 400 });
    }

    // 唯一邮箱
    const existed = await prisma.user.findUnique({ where: { email } });
    if (existed) {
      return NextResponse.json({ ok: false, message: "Email is already registered." }, { status: 409 });
    }

    // 创建用户（注意字段名：passwordHash、emailVerifiedAt）
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        emailVerifiedAt: new Date(),
        // 其余字段按默认值：avatarUrl、isSystemAccount=false、createdAt/updatedAt
      },
    });

    // 标记验证码已使用
    await prisma.emailVerification.update({
      where: { id: v.id },
      data: { usedAt: new Date() },
    });

    // 签发 JWT（字段与我们 lib/auth.ts 保持一致）
    const token = signJwt({
      uid: user.id,
      admin: user.isSystemAccount,
      ver: true,
      pwdv: user.passwordChangedAt ? new Date(user.passwordChangedAt).getTime() : null,
    });

    return NextResponse.json({
      ok: true,
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("REGISTER_ERROR:", err);
    return NextResponse.json({ ok: false, message: "Internal server error." }, { status: 500 });
  }
}
