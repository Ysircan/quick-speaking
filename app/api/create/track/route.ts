// app/api/create/track/route.ts

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import getCurrentUserFromRequest from "@/lib/getCurrentUser"

export async function POST(req: NextRequest) {
  const user = await getCurrentUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const {
      title,
      description,
      coverImage = "",
      durationDays,
      unlockMode = "DAILY",
      lang = "zh",
      tags = [],
      recommendedFor = [],
      isAIgenerated = false,
      customRules = {},
      isFree = true,
      isPublished = false,
    } = body

    if (!title || !description || !durationDays) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

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
    console.error("Failed to create track:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
