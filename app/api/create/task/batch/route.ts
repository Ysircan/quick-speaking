import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { QuestionType, DifficultyLevel } from "@prisma/client"

// ✅ [1] POST 方法：保存题目（你原本已有）
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { trackId, tasks } = body

    if (!trackId || !Array.isArray(tasks) || tasks.length === 0) {
      return NextResponse.json(
        { success: false, error: "缺少 trackId 或任务列表为空" },
        { status: 400 }
      )
    }

    // ✅ 严格检查每个 task 是否包含 dayIndex
    const hasMissingDay = tasks.some((task: any) => typeof task.dayIndex !== "number")
    if (hasMissingDay) {
      return NextResponse.json(
        { success: false, error: "每个任务必须明确包含 dayIndex" },
        { status: 400 }
      )
    }

    const typeMap: Record<string, QuestionType> = {
      "选择题": QuestionType.SINGLE_CHOICE,
      "多选题": QuestionType.MULTIPLE_CHOICE,
      "填空题": QuestionType.FILL_IN_BLANK,
      "简答题": QuestionType.SHORT_ANSWER,
      "打卡题": QuestionType.CHECKIN,
      "音频题": QuestionType.AUDIO,
      "视频题": QuestionType.VIDEO,
    }

    const difficultyMap: Record<string, DifficultyLevel> = {
      "简单": DifficultyLevel.EASY,
      "中等": DifficultyLevel.MEDIUM,
      "困难": DifficultyLevel.HARD,
    }

    const formattedTasks = tasks.map((task: any, index: number) => ({
      trackId: trackId,
      dayIndex: Number(task.dayIndex),  // ✅ 不再默认 fallback，必须传
      order: Number(task.order ?? index + 1),
      type: typeMap[task.type] ?? QuestionType.CHECKIN,
      content: typeof task.content === "string" ? task.content : "",
      mediaUrl: typeof task.mediaUrl === "string" ? task.mediaUrl : null,
      optionsJson: task.optionsJson ?? null,
      correctAnswer: task.correctAnswer ?? null,
      explanation: task.explanation ?? null,
      tags: Array.isArray(task.tags) ? task.tags : [],
      difficulty: difficultyMap[task.difficulty] ?? DifficultyLevel.MEDIUM,
      isAIgenerated: !!task.isAIgenerated,
      appearanceWeight: typeof task.appearanceWeight === "number" ? task.appearanceWeight : 100,
    }))

    const created = await prisma.task.createMany({
      data: formattedTasks,
      skipDuplicates: true,
    })

    return NextResponse.json({
      success: true,
      created: created.count,
    })
  } catch (err: any) {
    console.error("[TASK_BATCH_ERROR]", err)
    return NextResponse.json(
      { success: false, error: "服务器内部错误：" + err.message },
      { status: 500 }
    )
  }
}

// ✅ [2] GET 方法：读取题目（你现在要添加的部分）
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const trackId = searchParams.get("trackId")
  const dayIndex = Number(searchParams.get("dayIndex"))

  if (!trackId) {
    return NextResponse.json({ error: "缺少 trackId" }, { status: 400 })
  }

  const tasks = await prisma.task.findMany({
    where: {
      trackId,
      ...(isNaN(dayIndex) ? {} : { dayIndex }),
    },
    orderBy: { order: "asc" },
  })

  return NextResponse.json(tasks)
}
