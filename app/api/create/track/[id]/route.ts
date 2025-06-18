import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import getCurrentUserFromRequest from "@/lib/getCurrentUser"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const trackId = params.id

  try {
    const track = await prisma.track.findUnique({
      where: {
        id: trackId,
        createdById: user.id,
      },
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
        dayMetas: true,
      },
    })

    if (!track) {
      return NextResponse.json({ error: "Track not found." }, { status: 404 })
    }

    return NextResponse.json({
      track: {
        id: track.id,
        title: track.title,
        description: track.description,
        coverImage: track.coverImage,
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
    console.error("Failed to fetch track:", error)
    return NextResponse.json({ error: "Internal server error." }, { status: 500 })
  }
}
