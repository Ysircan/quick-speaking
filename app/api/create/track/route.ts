// app/api/create/track/route.ts

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import getCurrentUserFromRequest from "@/lib/getCurrentUser"

export async function POST(req: Request) {
  const user = await getCurrentUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ error: "未授权" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const {
      title,
      description,
      coverImage,
      durationDays,
      unlockMode,
      lang,
      tags,
      recommendedFor,
      isAIgenerated,
      customRules,
      isFree,
      isPublished,
    } = body

    const track = await prisma.track.create({
      data: {
        title,
        description,
        coverImage,
        durationDays,
        unlockMode,
        lang,
        tags,
        recommendedFor,
        isAIgenerated,
        customRules,
        isFree,
        isPublished,
        createdById: user.id,
      },
    })

    return NextResponse.json({
      success: true,
      track: {
        id: track.id,
        title: track.title,
        isPublished: track.isPublished,
        durationDays: track.durationDays,
        createdAt: track.createdAt,
      },
    })
  } catch (error) {
    console.error("创建训练营失败：", error)
    return NextResponse.json({ success: false, error: "创建失败" }, { status: 500 })
  }
}
