import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import getCurrentUserFromRequest from "@/lib/getCurrentUser"

export async function POST(
  req: NextRequest,
  { params }: { params: { taskId: string } }
) {
  const user = await getCurrentUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { taskId } = params

  try {
    const body = await req.json()
    const {
      cardId,
      probability = 1.0,
      requireCorrectAnswer = false,
      description,
      startAt,
      endAt,
    } = body

    if (!cardId || isNaN(probability) || probability < 0 || probability > 1) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }

    const drop = await prisma.taskDrop.upsert({
      where: {
        taskId_cardId: {
          taskId,
          cardId,
        },
      },
      update: {
        probability,
        requireCorrectAnswer,
        description,
        startAt: startAt ? new Date(startAt) : undefined,
        endAt: endAt ? new Date(endAt) : undefined,
      },
      create: {
        taskId,
        cardId,
        probability,
        requireCorrectAnswer,
        description,
        startAt: startAt ? new Date(startAt) : undefined,
        endAt: endAt ? new Date(endAt) : undefined,
      },
    })

    return NextResponse.json({ success: true, drop })
  } catch (error) {
    console.error("❌ Failed to save TaskDrop:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
