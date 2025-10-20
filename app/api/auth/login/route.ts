import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, normEmail, signJwt } from "@/lib/auth";

// POST /api/auth/login
// body: { email, password }
export async function POST(req: NextRequest) {
  try {
    const { email: rawEmail, password } = await req.json();

    if (!rawEmail || !password) {
      return NextResponse.json({ ok: false, message: "Missing email or password." }, { status: 400 });
    }

    const email = normEmail(rawEmail);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ ok: false, message: "Invalid email or password." }, { status: 401 });
    }

    if (!user.emailVerifiedAt) {
      return NextResponse.json({ ok: false, message: "Email not verified." }, { status: 403 });
    }

    const passOK = await comparePassword(password, user.passwordHash);
    if (!passOK) {
      return NextResponse.json({ ok: false, message: "Invalid email or password." }, { status: 401 });
    }

    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

    const token = signJwt({
      uid: user.id,
      admin: user.isSystemAccount,
      ver: true,
      pwdv: user.passwordChangedAt ? new Date(user.passwordChangedAt).getTime() : null,
    });

    return NextResponse.json({
      ok: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        isSystemAccount: user.isSystemAccount,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error("LOGIN_ERROR:", err);
    return NextResponse.json({ ok: false, message: "Internal server error." }, { status: 500 });
  }
}
