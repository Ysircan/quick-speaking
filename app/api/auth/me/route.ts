import { NextRequest, NextResponse } from "next/server";
import getCurrentUserFromRequest from "@/lib/getCurrentUserFromRequest";

export async function GET(req: NextRequest) {
  const user = await getCurrentUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      isSystemAccount: user.isSystemAccount,
      createdAt: user.createdAt,
    },
  });
}
