import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { QuestionType, DifficultyLevel } from "@prisma/client"

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

    const formattedTasks = tasks.map((task: any) => ({
      trackId: trackId,
      dayIndex: Number(task.dayIndex ?? 1),
      order: Number(task.order ?? 1), // 确保每个任务有顺序
      type: task.type as QuestionType ?? QuestionType.CHECKIN,
      content: typeof task.content === "string" ? task.content : "",
      mediaUrl: task.mediaUrl ?? null,
      optionsJson: task.optionsJson ?? null,
      correctAnswer: task.correctAnswer ?? null,
      explanation: task.explanation ?? null,
      tags: Array.isArray(task.tags) ? task.tags : [],
      difficulty: task.difficulty as DifficultyLevel ?? DifficultyLevel.MEDIUM,
      isAIgenerated: !!task.isAIgenerated,
      appearanceWeight: task.appearanceWeight ?? 100,
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
