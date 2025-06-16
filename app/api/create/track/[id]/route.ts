import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

// ✅ GET：获取某个训练营信息 + 每日任务节奏
export async function GET(
  req: NextRequest,
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
            order: true,
            createdAt: true,
          },
          orderBy: [{ dayIndex: "asc" }, { order: "asc" }],
        },
        dayMetas: true, // ✅ 加入每日节奏信息
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
      dayMetas: track.dayMetas.map((d) => ({
        dayIndex: d.dayIndex,
        goalType: d.goalType,
      })),
    })
  } catch (error) {
    console.error("获取训练营失败：", error)
    return NextResponse.json({ error: "服务器错误" }, { status: 500 })
  }
}
