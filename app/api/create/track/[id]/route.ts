// app/api/create/track/[id]/route.ts

import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// GET：获取某个训练营信息
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const trackId = params.id

  try {
    const track = await prisma.track.findUnique({
      where: { id: trackId },
      include: {
        tasks: {
          select: {
            id: true,
            dayIndex: true,
            type: true,
          },
          orderBy: [{ dayIndex: "asc" }, { createdAt: "asc" }],
        },
      },
    })

    if (!track) {
      return NextResponse.json({ error: "找不到训练营" }, { status: 404 })
    }

    return NextResponse.json({
      track: {
        id: track.id,
        title: track.title,
        description: track.description,
        durationDays: track.durationDays,
        unlockMode: track.unlockMode,
        tags: track.tags,
        recommendedFor: track.recommendedFor,
        isFree: track.isFree,
        isPublished: track.isPublished,
        tasks: track.tasks,
      },
    })
  } catch (error) {
    console.error("获取训练营失败：", error)
    return NextResponse.json({ error: "服务器错误" }, { status: 500 })
  }
}

// PUT：更新训练营信息
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const trackId = params.id
  const body = await req.json()

  try {
    const updated = await prisma.track.update({
      where: { id: trackId },
      data: {
        title: body.title,
        description: body.description,
        durationDays: body.durationDays,
        unlockMode: body.unlockMode,
        tags: body.tags,
        recommendedFor: body.recommendedFor,
        isFree: body.isFree,
        isPublished: body.isPublished,
      },
    })

    return NextResponse.json({ success: true, track: updated })
  } catch (error) {
    console.error("更新训练营失败：", error)
    return NextResponse.json({ error: "服务器错误" }, { status: 500 })
  }
}
