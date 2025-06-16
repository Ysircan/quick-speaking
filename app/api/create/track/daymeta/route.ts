import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// 允许的枚举值
const ALLOWED_GOAL_TYPES = ["STUDY", "EXERCISE", "READING", "CHECKIN", "TEST", "CUSTOM"]
const ALLOWED_UNLOCK_MODES = ["DAILY", "LINEAR", "FREE", "AFTER_X_DAYS", "MANUAL", "MILESTONE"]

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const trackId = searchParams.get("trackId")
    const dayIndex = Number(searchParams.get("dayIndex"))

    if (!trackId || isNaN(dayIndex)) {
      return NextResponse.json({ error: "参数缺失或错误" }, { status: 400 })
    }

    const meta = await prisma.trackDayMeta.findUnique({
      where: {
        trackId_dayIndex: { trackId, dayIndex },
      },
    })

    return NextResponse.json({ meta })
  } catch (error) {
    console.error("❌ GET /track-day-meta 错误:", error)
    return NextResponse.json({ error: "服务器错误" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      trackId,
      dayIndex,
      goalType,
      unlockMode,
      unlockParam = null,
      note = ""
    } = body

    const dayIndexNum = Number(dayIndex)

    if (!trackId || isNaN(dayIndexNum)) {
      return NextResponse.json({ error: "参数不完整" }, { status: 400 })
    }

    // ✅ 合法性检查：不合法就用默认值
    const safeGoalType = ALLOWED_GOAL_TYPES.includes(goalType) ? goalType : "STUDY"
    const safeUnlockMode = ALLOWED_UNLOCK_MODES.includes(unlockMode) ? unlockMode : "DAILY"

    const saved = await prisma.trackDayMeta.upsert({
      where: {
        trackId_dayIndex: { trackId, dayIndex: dayIndexNum },
      },
      update: {
        goalType: safeGoalType,
        unlockMode: safeUnlockMode,
        unlockParam,
        note,
      },
      create: {
        trackId,
        dayIndex: dayIndexNum,
        goalType: safeGoalType,
        unlockMode: safeUnlockMode,
        unlockParam,
        note,
      },
    })

    return NextResponse.json({ success: true, meta: saved })
  } catch (error) {
    console.error("❌ POST /track-day-meta 错误:", error)
    return NextResponse.json({ error: "服务器错误" }, { status: 500 })
  }
}
