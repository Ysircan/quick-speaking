import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Allowed enums
const ALLOWED_GOAL_TYPES = ["STUDY", "EXERCISE", "READING", "CHECKIN", "TEST", "CUSTOM"]
const ALLOWED_UNLOCK_MODES = ["DAILY", "LINEAR", "FREE", "AFTER_X_DAYS", "MANUAL", "MILESTONE"]

// ✅ GET: Fetch a day's configuration by trackId and dayIndex
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const trackId = searchParams.get("trackId")
    const dayIndex = Number(searchParams.get("dayIndex"))

    if (!trackId || isNaN(dayIndex)) {
      return NextResponse.json({ error: "Missing or invalid parameters." }, { status: 400 })
    }

    const meta = await prisma.trackDayMeta.findUnique({
      where: {
        trackId_dayIndex: { trackId, dayIndex },
      },
    })

    return NextResponse.json({ meta })
  } catch (error) {
    console.error("❌ Error in GET /track-day-meta:", error)
    return NextResponse.json({ error: "Internal server error." }, { status: 500 })
  }
}

// ✅ POST: Create or update day configuration
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      trackId,
      dayIndex,
      goalType,
      unlockMode,
      unlockParam = null,
      note = "",
    } = body

    const dayIndexNum = Number(dayIndex)

    if (!trackId || isNaN(dayIndexNum)) {
      return NextResponse.json({ error: "Incomplete parameters." }, { status: 400 })
    }

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
    console.error("❌ Error in POST /track-day-meta:", error)
    return NextResponse.json({ error: "Internal server error." }, { status: 500 })
  }
}
